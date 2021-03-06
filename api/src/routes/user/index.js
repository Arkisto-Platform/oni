import { getLogger } from '../../services';
import { isUndefined } from 'lodash';
import { getUser, updateUser } from '../../controllers/user';
import { v4 as uuidv4 } from 'uuid';
import { routeUser } from '../../middleware/auth';

const log = getLogger();

export function setupUserRoutes({ server, configuration }) {
  server.get("/user", routeUser(async (req, res, next) => {
      try {
        if (req.session.user) {
          const user = await getUser({ where: { id: req.session.user.id } });
          user['apiToken'] = null;
          user['accessToken'] = '....removed';
          res.json({ user }).status(200);
        } else {
          res.json({ user: null }).status(200);
        }
      } catch (e) {
        log.error(e);
        res.send({ error: e['message'] }).status(500);
        next();
      }
    })
  );
  server.get("/user/token", routeUser(async (req, res, next) => {
      try {
        if (req.session.user) {
          const id = req.session.user.id;
          const user = await updateUser({
            where: { where: { id: id } },
            key: 'apiToken',
            value: uuidv4()
          });
          user['accessToken'] = '...removed';
          res.json({ user }).status(200);
        } else {
          res.json({ user: null }).status(200);
        }
      } catch (e) {
        log.error(e);
        res.send({ error: e['message'] }).status(500);
        next();
      }
    })
  );
  server.del("/user/token", routeUser(async (req, res, next) => {
      try {
        if (req.session.user) {
          const id = req.session.user.id;
          const user = await updateUser({
            where: { where: { id: id } },
            key: 'apiToken',
            value: null
          });
          user['accessToken'] = '...removed';
          res.json({ user }).status(200);
        } else {
          res.json({ user: null }).status(200);
        }
      } catch (e) {
        log.error(e);
        res.send({ error: e['message'] }).status(500);
        next();
      }
    })
  );
}
