const authController = {
    async register(req, res) {
        try{
            const { name, email, password } = req.body;
            console.log(name, email, password);
        }
        catch(err){
            console.log(err);
        }        
        res.json({ message: 'Register' });


    }
    // ,
    // async verify(req, res) {
    //     res.json({ message: 'Verify' });
    // },
    // async login(req, res) {
    //     res.json({ message: 'Login' });
    // }
    // ,
    // async logout(req, res) {
    //     res.json({ message: 'Logout' });
    // }
    // ,
    // async forgotPassword(req, res) {
    //     res.json({ message: 'Forgot Password' });
    // }
    // ,
    // async resetPassword(req, res) {
    //     res.json({ message: 'Reset Password' });
    // }
    // ,
    // async me(req, res) {
    //     res.json({ message: 'Me' });
    // }
    
}

module.exports = authController;