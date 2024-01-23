export function greet(name) {
    return `Hello, ${name}`;
}
export const message = "How you doing?";

// $(document).ready(function() {
//   console.log("config");
// });


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
  return fetch(config.endpoint.updateContact, requestOptions)
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