const mongoose = require('mongoose');
const schema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', schema, 'users');
const Wallet = mongoose.model('Wallet', schema, 'wallets');

mongoose.connect('mongodb://127.0.0.1:27017/three-m').then(async () => {
    const user = await User.findOne();
    if (!user) {
        console.log('No user found');
        process.exit(0);
    }
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
        await Wallet.create({ 
            userId: user._id, 
            availableBalance: 10000, 
            totalBalance: 10000,
            currency: 'INR'
        });
    } else {
        await Wallet.updateOne(
            { _id: wallet._id }, 
            { $set: { availableBalance: 10000, totalBalance: 10000 } }
        );
    }
    console.log('✅ Wallet topped up for user: ' + user.email);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
