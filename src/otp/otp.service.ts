import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from './schemas/otp.schema';
import { Model } from 'mongoose';
import { CreateOtpDto } from './dto/create-otp.dto';
import { QueueService } from '../queues/queue.service';
import { sendEmailApi } from '../utils/sendEmail';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    private queueService: QueueService,
  ) {}

  async sendOtpViaEmail(
    email,
    is_verify_user: boolean = false,
    fullName: string = null,
  ) {
    const otp = await this.generateOtp({ email });

    sendEmailApi({
      to: otp.email,
      subject: 'Verify Your Email',
      htmlContent: `
    <p style="color: #2e2e2e; font-size: 16px">
    Thank you for signing up!. 
    Please use the following code below to verify your email address
    <br /><br />
    Verification Code: <b>${otp.otp}</b><br /><br />
    
    Enter this code within 15 minutes to confirm your email. If you didn't request this code, kindly disregard this email. 
    <br/> Reach out to our customer support for assistance.<br /><br />`,
    });
    // send email
    await this.queueService.sendEmail({
      to: otp.email,
      template: is_verify_user ? '/VerifyUser' : '/Otp',
      subject: 'Trades Trek OTP',
      context: { otp: otp.otp, email: otp.email, fullName },
    });
    return null;
  }

  async generateOtp(createOtpDto: CreateOtpDto) {
    const { email, phone } = createOtpDto;
    const otp_pass_code = this.generateOtpPassCode();
    return (
      (await this.otpModel.findOneAndUpdate(
        { email },
        { otp: otp_pass_code },
        { new: true },
      )) ??
      (await this.otpModel.create({
        email,
        phone,
        otp: otp_pass_code,
      }))
    );
  }

  generateOtpPassCode() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async verifyOtpViaMail(email: string, otp: number) {
    return !!(await this.otpModel.findOneAndDelete({ otp, email }));
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
