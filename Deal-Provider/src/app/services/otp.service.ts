import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private apiUrl = 'https://bulksmsplans.com/api/send_sms';
  private apiId = 'APIJjmI6iDG132925';
  private apiPassword = 'NaBjgVSm';
  private sender = 'SKHSLP';
  private templateId = '165284';

  public constructor(private http: HttpClient) { }

  private generateOtp(): number {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
  }

  public sendOtp(number: string): Observable<{ response: any, otp: number }> {
    const otp = this.generateOtp();
    const message = `Your verification code is ${otp} for login. Enter this code to confirm your mobile number. Regards SWAYAMKRUSHI HOME SERVICES LLP`;

    const params = {
      api_id: this.apiId,
      api_password: this.apiPassword,
      sms_type: 'Transactional',
      sms_encoding: 'text',
      sender: this.sender,
      number: number,
      message: message,
      template_id: this.templateId
    };

    const url = `${this.apiUrl}?${this.toQueryString(params)}`;

    return this.http.get(url).pipe(
      map(response => ({ response, otp })),
      catchError(error => of({ response: error, otp }))
    );
  }

  private toQueryString(params: any): string {
    return Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }
}
