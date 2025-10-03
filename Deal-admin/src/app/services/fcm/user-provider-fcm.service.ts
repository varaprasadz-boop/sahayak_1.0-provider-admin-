import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProviderFcmService {

  private fcmUrl = 'https://fcm.googleapis.com/v1/projects/sahayak-online/messages:send';
  private tokenUrl = 'https://admin.sahayakonline.com/token/generate/token.php';

  constructor(private http: HttpClient) { }

  sendMessageAndGetToken(title: string, body: string, fcm_token: string): Observable<any> {
    // First, get the token from sahayakonline.com
    return this.http.get<string>(this.tokenUrl, { responseType: 'text' as 'json' }) // Specify responseType as text
      .pipe(
        catchError(error => {
          console.error('Error fetching token:', error);
          return of(null); // Handle errors gracefully
        }),
        switchMap(responseText => {
          // Extract JSON part from the responseText
          const jsonStartIndex = responseText.indexOf('{');
          const jsonEndIndex = responseText.lastIndexOf('}');
          const jsonResponse = responseText.substring(jsonStartIndex, jsonEndIndex + 1);

          try {
            const tokenResponse = JSON.parse(jsonResponse); // Parse JSON response
            const token = tokenResponse.access_token; // Assuming the response has an 'access_token' property

            // Use the obtained token to send FCM message
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            });

            const fcmMessage = {
              message: {
                token: fcm_token,
                notification: {
                  body: body,
                  title: title
                }
              }
            };

            return this.http.post<any>(this.fcmUrl, fcmMessage, { headers });
          } catch (error) {
            console.error('Error parsing token response:', error);
            return of(null); // Handle parsing errors gracefully
          }
        })
      );
  }
}