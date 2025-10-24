import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Cocktail from './models/Cocktail';

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('cocktails');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    const [admin, user] = await User.create(
        {
            username: 'admin',
            email: 'admin@gmail.com',
            password: '54321',
            displayName: 'Admin',
            role: 'admin',
            token: crypto.randomUUID(),
        },
        {
            username: 'Cat',
            email: 'cat@gmail.com',
            password: '12345',
            displayName: 'Kitty',
            role: 'user',
            token: crypto.randomUUID(),
        }
    );

    console.log('Users created!');

    await Cocktail.create(
        {
            user: admin._id,
            title: 'Mojito',
            recipe: 'Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice. Pour the rum and top with soda water. Garnish with sprigs of mint and lime slice.',
            image: 'mojito.jpg',
            isPublished: true,
            ingredients: [
                { name: 'White rum', amount: '50 ml' },
                { name: 'Fresh lime juice', amount: '30 ml' },
                { name: 'Sugar', amount: '2 tsp' },
                { name: 'Mint leaves', amount: '10 leaves' },
                { name: 'Soda water', amount: '100 ml' },
            ],
            ratings: [
                { user: admin._id, rating: 5 },
                { user: user._id, rating: 1 },
            ],
        },
        {
            user: user._id,
            title: 'Margarita',
            recipe: 'Rub the rim of the glass with the lime slice to make the salt stick to it. Shake the tequila, lime juice and triple sec with ice, then carefully pour into the glass (taking care not to dislodge any salt). Garnish with a lime slice.',
            image: 'Margarita.jpg',
            isPublished: true,
            ingredients: [
                { name: 'Tequila', amount: '50 ml' },
                { name: 'Lime juice', amount: '25 ml' },
                { name: 'Triple sec', amount: '20 ml' },
                { name: 'Salt', amount: 'for rim' },
                { name: 'Lime slice', amount: 'for garnish' },
            ],
            ratings: [
                { user: admin._id, rating: 4 },
            ],
        },
        {
            user: user._id,
            title: 'Pina Colada',
            recipe: 'Blend all the ingredients with ice in an electric blender. Pour into a large goblet or Hurricane glass and serve with straws. Garnish with pineapple wedge and cherry.',
            image: 'pinacolada.jpg',
            isPublished: false,
            ingredients: [
                { name: 'White rum', amount: '50 ml' },
                { name: 'Coconut cream', amount: '30 ml' },
                { name: 'Pineapple juice', amount: '90 ml' },
                { name: 'Ice', amount: '1 cup' },
            ],
            ratings: [],
        },
    );

    console.log('Cocktails created!');
    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@test.com / admin123');
    console.log('User: john@test.com / john123');
    console.log('=========================\n');

    await db.close();
};

run().catch(console.error);