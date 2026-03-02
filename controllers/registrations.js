const Registration = require('../models/Registration');
const Company = require('../models/Company');

exports.getRegistrations=async(req,res,next)=>{
    let query;
    if(req.user.role !== 'admin'){
        query = Registration.find({user:req.user.id}).populate({
            path:'company',
            select:'name business tel'
        });
    }
    else{
        if(req.params.companyId){
            query = Registration.find({company:req.params.companyId}).populate({
                path:'company',
                select:'name business tel'
            });
        }
        else {query = Registration.find().populate({
                path:'company',
                select:'name business tel'
        });}
    }
    try{
        const registrations = await query;
        res.status(200).json({
            success:true,
            count:registrations.length,
            data:registrations
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Cannot find Registration"
        })
    }
};

exports.getRegistration = async(req,res,next) => {
    try{
        const registration = await Registration.findById(req.params.id).populate({
            path:'company',
            select:'name description tel'
        });
        if(!registration){
            return res.status(404).json({
                success:false,message:`No registration with the id of ${req.params.id}`});
        }
        if(req.user.role !== 'admin' && registration.user.toString() !== req.user.id){
            return res.status(401).json({
                success:false,message:`User ${req.user.id} is not authorized to access this registration`
            });
        }
        res.status(200).json({
            success:true,
            data:registration
        })
    }catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,message:"Cannot find Registration"
        })
    }
};

exports.createRegistration = async(req,res,next)=>{
    try{
        
        const companyId = req.params.companyId || req.body.company;
        req.body.company = companyId;

        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                success:false,message:`No company with the id of ${companyId}`
            });
        }

        req.body.user = req.user.id;

        const existedRegistrations = await Registration.find({user:req.user.id});
        if(existedRegistrations.length>=3&&req.user.role!=='admin'){
            return res.status(400).json({
                success:false,message:`The user with ID ${req.user.id} has already made 3 registrations`
            });
        }

        const existing = await Registration.findOne({user:req.user.id,company:companyId});
        if(existing){
            return res.status(400).json({
                success:false,message:'User already registered with this company'
            });
        }
        console.log(req.body);
        const registration = await Registration.create(req.body);
        res.status(201).json({
            success:true,
            data:registration
        })
    }catch(error){
        console.log(error);
        if(error.name === 'ValidationError'){
            return res.status(400).json({
                success:false,message:error.message
            });
        }
        return res.status(500).json({
            success:false,message:"Cannot create Registration"
        });
    }
}

exports.updateRegistration=async(req,res,next)=>{
    try{
        let registration = await Registration.findById(req.params.id);

        if(!registration){
            return res.status(404).json({
                success:false,message:`No registration with the id of ${req.params.id}`
            });
        }
        if(registration.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,message:`User ${req.user.id} is not authorized to update this registration`
            })
        }
        registration = await Registration.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        res.status(200).json({
            success:true,
            data:registration
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,message:"Cannot update Registration"
        });
    }
}

exports.deleteRegistration = async(req,res,next)=>{
    try{
        const registration = await Registration.findById(req.params.id);
        if(!registration){
            return res.status(404).json({
                success:false,message:`No registration with the id of ${req.params.id}`
            });
        }
        if(registration.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                success:false,message:`User ${req.user.id} is not authorized to delete this registration`
            })
        }
        await registration.deleteOne();
        res.status(200).json({
            success:true,data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,message:"Cannot delete Registration"
        });
    }
}