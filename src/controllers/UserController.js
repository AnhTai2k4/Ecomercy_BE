const UserService = require('../services/UserService')
const createUser= async (req,res)=>{
    try{
        const {name, email, password,confirmPassword, phone} = req.body
        const isCheckEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if(!name||!email||!confirmPassword||!password||!phone){
            return res.status(400).json({
                status: "Loi fu lieu",
                message:"gui thieu du lieu"
            }
            )
        }
        else if(!isCheckEmail.test(email)){
            return res.status(400).json({
                status: "Loi email",
                message:"Dien email sai dinh dang"
            })

        }
        else if(password!==confirmPassword){
                return res.status(400).json({
                status: "Loi password",
                message:"password khac confirmPassword"
            })
        }
        else {
            await UserService.createUser({name, email, password,confirmPassword, phone})
        }

    } 
    catch(e){
        return res.status(404).json({
            message:e
        })

    }

}

module.exports = {
    createUser
}

