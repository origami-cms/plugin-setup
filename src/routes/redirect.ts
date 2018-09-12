import {Origami, Route} from 'origami-core-lib';

// Redirect the user after setup
export default new Route('/setup')
    .position('init')
    .get(async (req, res, next) => {
        const user = await res.app.get('store').model('user') as Origami.Store.Model;
        const users = await user.find({});

        if (users && users.length) return res.redirect(303, '/');
        next();
    });
