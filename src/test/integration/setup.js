import * as jwt from 'jsonwebtoken';
import fs from 'fs';

export let createTokenWithClaims = ({claims=buildClaimsForGodlikeUser(), secretKey=buildSecretKey()} = {})=>{
  const token = jwt.sign(claims, secretKey, {algorithm: 'RS256', header: {alg: 'RS256', iss: claims.iss}  });//headers: {iss: claims.iss} <- only with 5.7
  return token;
};

function buildSecretKey({privateKeyPath='./keys/test/fake_private_key.pem'}={}){
  let privateKey = fs.readFileSync(privateKeyPath);
  return privateKey;
}

export function buildClaimsForGodlikeUser({userId=1, orgId=1}={}){
  let claims = {
    "iss": "IDM",
    "iat": 1489101288,
    "exp": 9999999999,
    "idmid": userId,
    "idmGuid": userId,
    "crmtype": "crm",
    "stasub": "insidesales",
    "orgid": orgId,
    "crmuid": null,
    "abl": true,
    "tyk_key_policy_id": "56b225d5ec06591d75000006",
    "licenses": [  ],
    "capabilities": [        ],
    "permissions": [ "rp_create_permission", "rp_get_permission", "rp_update_permission", "rp_add_user_org_role", "rp_create_org_role", "rp_delete_user_org_role",
      "rp_get_org_role",  "rp_get_user", "rp_get_user_permissions", "rp_replace_user_org_roles", "rp_update_org_role", "rp_add_user_shared_role",
      "rp_create_shared_role", "rp_get_shared_role", "rp_delete_user_shared_role", "rp_get_user_shared_role", "rp_update_shared_role",
      "idm_impersonate_username", "assign_idm_impersonate_user", "rp_manage_org_roles", "admin_any_org",
    ]
  };
  return claims;
}