const UserRoutes = require('./UserRoutes')
const ProductRoutes = require('./ProductRoutes')
const routes= (app)=>{
    app.use('/api/user',UserRoutes)
    app.use('/api/product',ProductRoutes)

}

module.exports= routes