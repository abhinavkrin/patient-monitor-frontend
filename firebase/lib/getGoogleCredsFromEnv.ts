export const getGoogleCredsFromENV = () => {
  if(typeof window === 'undefined'){
    const data = JSON.parse(process.env.GOOGLE_CREDS_CONFIG);
    const returnData = {
      type: data.type,
      projectId: data.project_id,
      privateKeyId: data.private_key_id,
      privateKey: data.private_key,
      clientEmail: data.client_email,
      clientId: data.client_id,
      authUri: data.auth_uri,
      tokenUri: data.token_uri,
      authProviderX509CertUrl: data.auth_provider_x509_cert_url,
      clientX509CertUrl: data.client_x509_cert_url
    }
    return returnData;
  }
  throw new Error("This function can only be called from client side");
}
