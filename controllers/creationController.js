const addData =  async (req, res) => {
    const {email, password, role} = req.body
    console.log(`Email: ${email} || Password: ${password}`)

    if(!email || !password){
        console.log("Please enter some creditionals")
        return res.status(400).json({msg: "Please enter some creditionals"})
    }

    try{
        let employee = new Employee({email,password,role})
        await employee.save()
        res.status(201).json({msg:"Employee added successfully"})
    }catch(err){
        console.log("An error occurred",err)
        return res.status(500).json({msg:"An error occurred"})
    }
}

module.exports = {addData}