import { App } from './config/app'

const app = new App()
app.start().then(() => console.log('App initialized')).catch(console.error)
