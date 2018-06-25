import * as Boom from 'boom';
import * as logger from 'logger';

//permission that allows the user to access any route.
const admin_any_org = 'admin_any_org';

/**
 * Plugin for ensuring that the user token has appropriate permissions and orgId needed to access the route.
 * Users with the 'admin_any_org' are granted access to all routes, regardless of their orgId.
 *
 * Verbose usage example:
 * permissionsWithinOrg: {
 *  //user must be in the same org, and have at least one of these permissions to access the route
 *  any: ['rp_create_org_role', 'rp_manage_org_roles'],
 *
 *  //optional. by default getOrgId returns request.params.orgId. override if orgId is passed via other means.
 *  getOrgId(request, reply){...},
 * }
 *
 * Terse usage example:
 * //shortcut for any permissions with default getOrgId
 * permissionsWithinOrg:['rp_create_org_role', 'rp_manage_org_roles']
 */
export default {
  name: 'permissionsWithinOrg',
  version: '1.0.0',
  register: (server, options) => {
    //intercept all requests after auth phase has completed.
    server.ext('onPostAuth', function (request, reply) {
      const {permissionsWithinOrg: routePermissionsPluginConfig} = request.route.settings.plugins;
      //exit if no permissions config is defined on the route.
      if(routePermissionsPluginConfig === undefined){
        return reply.continue;
      }

      const {tokenUser} = request.jwt;
      const {idmGuid, permissions: userPermissions, orgid: userOrgId} = tokenUser;
      //get the any required permissions from the route's permissions configuration
      const {any: anyPermissionsRequiredToAccessRoute, getOrgId} = getAnyPermissionsAndOrgIdFunctionFromPluginConfig(routePermissionsPluginConfig);

      //determine if the user has access
      logger.log(`permissionsWithinOrgPlugin checking if user guid: ${idmGuid} with permissions: ${userPermissions} has access to route path: ${request.route.path} which requires any permissions: ${anyPermissionsRequiredToAccessRoute}`);
      const hasPermission = doesUserHaveAccessToRoute({userPermissions, userOrgId, anyPermissionsRequiredToAccessRoute,
        getOrgId, accessAllRoutesPermission: admin_any_org, request, reply});
      if(!hasPermission){
        return reply(Boom.unauthorized(`user has permissions: ${tokenUser.permissions} but the route path requires one of the following permissions: ${anyPermissionsRequiredToAccessRoute}`));
      }
      return reply.continue;
    });
  }
};

/**
 * Determines if the user has permission by comparing the user's permissions and the route config's permissions config "any" permissions.
 * If the user has any of the permissions defined in the config and has the same org returned by getOrgId, access is granted.
 * Alternatively, if the user has the permission name defined by the accessAllRoutesPermission param (e.g. "admin_all_orgs"), the user is granted access.
 * @param userPermissions - tokenUser.permissions array of permission names.
 * @param userOrgId - tokenUser.orgId
 * @param anyPermissionsRequiredToAccessRoute - array of permission names that the user must have one of in order to access the route.
 * @param getOrgId - function which returns the orgId attempted to be accessed/modified. this is compared to the userOrgId to see if access is allowed.
 * @param request - hapi request obj passed into the getOrgId function
 * @param reply - hapi reply function passed into the getOrgId function
 * @param accessAllRoutesPermission - permission name used to bypasses all checks and returns true when userPermissions includes it.
 * @returns {boolean} - whether or not the user has permission.
 */
function doesUserHaveAccessToRoute({userPermissions, userOrgId, anyPermissionsRequiredToAccessRoute, getOrgId, request, reply, accessAllRoutesPermission}){
  //if the user has 'admin_any_org' permission, they have access
  if(userPermissions.includes(accessAllRoutesPermission)){
    return true;
  }
  //check to see if the user has the required permissions needed to access the route
  const userHasRequiredPermission = doesUserHaveAnyOfThePermissions(userPermissions, anyPermissionsRequiredToAccessRoute);
  //check to see if the user is in the same org
  const userIsInSameOrg = getOrgId(request, reply) === userOrgId;
  //if user has one of the required permissions, and the user is in the same org they are trying to access/modify, they have access.
  const hasAccess = userHasRequiredPermission && userIsInSameOrg;
  return hasAccess;
}

/**
 * The routePermissionsPluginConfig can either be an array or an object with an "any" property and a "getOrgId" function.
 * If the config is an array, it is assumed to be a shortcut for any, and the default getOrgId function should be used.
 * If the config is an object, the "any" property and "getOrgId" property are used, if defined (otherwise defaults are used).
 * @param routePermissionsPluginConfig - array or object
 * @returns { any:[], getOrgId:function(request, reply){...} } - object containing "any" permission array and getOrgId function.
 */
function getAnyPermissionsAndOrgIdFunctionFromPluginConfig(routePermissionsPluginConfig={}){
  let result = {any: [], getOrgId: defaultGetOrgIdFunction};
  if(Array.isArray(routePermissionsPluginConfig)){
    result.any = routePermissionsPluginConfig;
  }else{
    result.any = routePermissionsPluginConfig.any || result.any;
    result.getOrgId = routePermissionsPluginConfig.getOrgId || result.getOrgId;
  }
  return result;
}

/**
 * Most routes have the org id in the path aka request.params, so by default we can just check request.params.orgId.
 * Plugin allows for getOrgId function to be overridden when needed.
 * @param request - hapi request object
 * @param reply - hapi reply function
 */
function defaultGetOrgIdFunction(request, reply){
  const orgId = request.params.orgId;
  return parseInt(orgId);
}

/**
 * Determines if the user has at least one of the supplied permissions.
 * @param userPermissions - array of user's permission names
 * @param permissions - permissions to check
 * @returns {boolean}
 */
function doesUserHaveAnyOfThePermissions(userPermissions=[], permissions=[]){
  let userHasAtLeastOneSpecifiedPermission = permissions.some(p=>userPermissions.includes(p));//stops executing as soon as true is returned.
  return userHasAtLeastOneSpecifiedPermission;
}