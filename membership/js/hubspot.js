import {updateContactEndpoint} from  "{{ get_asset_url('../../membership/js/endpoints.js') }}";

export async function updateContact(contactId, data){
  var requestOptions = {
    'method': 'PUT',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      contactId: contactId,
      data: data,
    }),
  };
  return fetch(updateContactEndpoint, requestOptions)
    .then(res => {
    if(res.ok) {
      return res.json();
    }
    return res.json().then(error => {
      console.log(error);
      throw error;
    });
  });
}



// export class Hubspot {
//   async updateContact(contactId, data) {
//       var requestOptions = {
//     'method': 'PUT',
//     'headers': {
//       'Content-Type': 'application/json',
//     },
//     'body': JSON.stringify({
//       contactId: contactId,
//       data: data,
//     }),
//   };
//   return await fetch(updateContactEndpoint, requestOptions)
//     .then(res => {
//     if(res.ok) {
//       return res.json();
//     }
//     return res.json().then(error => {
//       console.log(error);
//       throw error;
//     });
//   }); 
//   }
// }
