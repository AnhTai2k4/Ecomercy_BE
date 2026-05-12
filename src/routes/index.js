const UserRoutes = require('./UserRoutes')
const ProductRoutes = require('./ProductRoutes')
const CourseRoutes = require('./CourseRoutes')
const routes= (app)=>{
    app.use('/api/user',UserRoutes)
    app.use('/api/product',ProductRoutes)
    app.use('/api/course', CourseRoutes )

}

module.exports= routes