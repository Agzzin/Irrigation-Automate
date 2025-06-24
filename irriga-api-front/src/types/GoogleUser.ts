// Estrutura típica do retorno do GoogleSignin.signIn()
// Veja https://github.com/react-native-google-signin/google-signin/blob/master/docs/api.md#signin

export type GoogleUser = {
  idToken?: string;
  serverAuthCode?: string;
  scopes?: string[];
  user: {
    email: string;
    id: string;
    name?: string;
    photo?: string;
    givenName?: string;
    familyName?: string;
  };
};
