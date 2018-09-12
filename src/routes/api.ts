import {Route, Origami, auth} from 'origami-core-lib';
import createError from 'http-errors';

export default new Route('/api/v1/setup')
    .position('store')
    .post(async (req, res, next) => {
        const user = await res.app.get('store').model('user') as Origami.Store.Model;
        const users = await user.find({});

        if (!users || users.length) {
            // tslint:disable-next-line
            return next(createError(401, 'Origami is already setup'));
        }

        try {
            const newUser = await user.create(req.body);
            const secret = res.app.get('secret');

            const token = auth.jwtSign({
                userId: newUser.id,
                email: newUser.email
            }, secret);

            const {iat: expires} = auth.jwtVerify(token, secret);

            res.data = {token, expires};
            res.text = 'Successfully setup new user';
            next();

        } catch (e) {
            next(e);
        }
    });
