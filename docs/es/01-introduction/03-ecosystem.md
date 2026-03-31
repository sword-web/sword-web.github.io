# Ecosistema e integraciones

Sword está construido sobre sobre el ecosistema `Tokio`. Esto significa que puedes utilizar cualquier crate compatible con este runtime asíncrono.

Al igual que Axum, Sword es compatible con `tower` y su ecosistema de `layers`. Sword proporciona algunos `layer` de `tower` integrados por defecto y son configurables a través del archivo de configuración.

En cuanto a servicios externos como bases de datos, caches o colas de mensajes, se recomienda configurarlos mediante `structs` personalizadas que se deserialicen desde el archivo de configuración. Hablaremos más sobre el fichero de configuración en secciones posteriores.
