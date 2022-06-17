import * as hapi from '@hapi/hapi'
import userRouters from './user';

const routers: Array<hapi.ServerRoute> = [].concat(userRouters)

export default routers;