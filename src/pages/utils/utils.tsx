

import axios from 'axios';

export function myGlobalFunction(userData:any): Promise<any> {
    return new Promise((resolve, reject) => {
        let refreshConfig = {
          headers: {
            'Authorization': "Bearer " + userData.refreshToken
          }
        };
    
      
        axios.post("http://localhost:8080/api/auth/refresh-token", null, refreshConfig)
          .then(response => {
          
           let refreshedResponse= {
            jwtToken:response.data.token
           };
            
           
            resolve(refreshedResponse);
          })
          .catch(error => {
            // Gestisci gli errori
            console.error("Errore durante il refresh del token:", error);
            reject(error);
          });
      });

   
  }