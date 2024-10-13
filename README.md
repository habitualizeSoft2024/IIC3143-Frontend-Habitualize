# Bienvenido a Habitualize 👋

Una aplicación que te ayudará a crear hábitos saludables y a mantenerlos.

- Versión en producción (rama `main`): https://habitualize.netlify.app/

- Versión en desarrollo (rama `dev`): https://dev--habitualize.netlify.app/

## Para correr la aplicación...

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Corre la aplicación:

   ```bash
    npx expo web
   ```

¡Listo! La aplicación debió haber abierto en tu navegador. De otro modo, puedes abrirla manualmente siguiendo las indicaciones mostradas en la consola.

## Para realizar commits...

1. Asegúrate de haber instalado las dependencias:

   ```bash
   npm install
   ```

2. Para realizar un _commit_ utiliza el siguiente comando, que te guiará en el proceso para que cumplas con el formato adecuado:

   ```bash
   npm run convcommit
   ```

   El repositorio cuenta con _pre-commit hooks_ que se encargan de asegurar que se cumplan ciertos requisitos. Para cambios pequeños y rápidos que no requiran mayores verificaciones, puedes saltarte este paso utilizando la _flag_ `--no-verify`:

   ```bash
   npm run convcommit -- --no-verify
   ```