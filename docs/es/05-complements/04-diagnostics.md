---
title: "Diagnósticos"
description: "Cómo reporta Sword los fallos de build, arranque y apagado, y cómo elegir entre miette y tracing."
outline: [2, 3]

keywords: ["diagnósticos", "errores", "miette", "tracing", "arranque", "rust"]
---

# Diagnósticos

Sword trata los fallos de build y arranque como **diagnósticos**: datos
estructurados con un código estable, una fase, un motivo, contexto opcional y un
span de origen. El renderer decide cómo mostrarlos.

Los errores de request y validación no son diagnósticos. Quedan en la respuesta
HTTP o gRPC, o en eventos normales de tracing.

## Renderers

`[application] diagnostics` elige el renderer:

```toml
[application]
diagnostics = "miette"
```

`miette` es el valor por defecto. Imprime un informe humano con el código, la
fase, el mensaje, un snippet cuando hay span, y un bloque `help`:

```text
sword.build.web — Build error

  × Invalid [web] configuration: host must not be empty

   ╭─[Config.toml:2:8]
 1 │ [web]
 2 │ host = ""
   ·        ─┬
   ·         ╰── must not be empty
   ╰────

  help: Use a valid host such as 0.0.0.0 or 127.0.0.1
```

`tracing` emite un evento estructurado por diagnóstico con `code`, `phase`,
`engine`, `source` y `reason`. Requiere un subscriber activo; si no lo hay, Sword
reporta un error de configuración en vez de perder el diagnóstico en silencio.

## De dónde salen

Cada crate valida su propia sección de configuración:

| Sección | Dueño |
|---|---|
| `[application]` | `sword` |
| `[tracing]` | `sword-layers` |
| `[web]` | `sword-web` |
| `[grpc]` | `sword-grpc` |
| `[events]` | `sword-events` |
| `[socketio]` | `sword-socketio` |

Las secciones ausentes usan sus defaults y no se validan. Una sección que existe
pero tiene tipos o valores inválidos reporta todos sus problemas, con un label
por clave, y detiene el arranque.

## Un único reporte

`#[sword::main]` es el único punto de reporte:

```rust
#[sword::main]
async fn main() -> Result<(), Error> {
    Application::from_config_path("Config.toml")?.run().await
}
```

Devolver `Err` renderiza el diagnóstico una sola vez y sale con código de fallo.
Lo mismo pasa si no se puede construir el runtime de Tokio.

## Códigos

Los códigos siguen `sword.<fase>.<subsistema>` y son estables. Cada crate
documenta en su API los códigos que emite.
