from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_booking_confirmation_email(booking):
    """Send email when booking is submitted"""
    subject = f'Booking Request Submitted'
    
    try:
        car = booking.car
        car_reg = car.registration_number if car else 'Unknown'
        car_brand = car.brand if car else 'Unknown'
        car_model = car.model if car else 'Unknown'
        
        employee = booking.employee
        employee_name = employee.get_full_name() or employee.username if employee else 'User'
        employee_email = employee.email if employee else ''
        
        if not employee_email:
            print("No employee email found, skipping email")
            return
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .booking-details {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .status-pending {{ background: #ffc107; color: #333; padding: 5px 10px; border-radius: 5px; display: inline-block; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🚗 Booking Request Submitted</h2>
                </div>
                <div class="content">
                    <h3>Hi {employee_name},</h3>
                    <p>Your car booking request has been submitted successfully and is now pending manager approval.</p>
                    
                    <div class="booking-details">
                        <h4>📋 Booking Details</h4>
                        <p><strong>Car:</strong> {car_brand} {car_model} ({car_reg})</p>
                        <p><strong>Destination:</strong> {booking.destination}</p>
                        <p><strong>Purpose:</strong> {booking.purpose}</p>
                        <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}</p>
                        <p><strong>End Time:</strong> {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.end_datetime else 'N/A'}</p>
                        <p><strong>Estimated KM:</strong> {booking.estimated_km} km</p>
                        <p><strong>Status:</strong> <span class="status-pending">Pending Approval</span></p>
                    </div>
                    
                    <p>You will receive another email once your manager reviews the request.</p>
                    <p><a href="http://localhost:3000/my-bookings">View My Bookings</a></p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Fleet Car Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Booking Request Submitted
        
        Hi {employee_name},
        
        Your car booking request has been submitted successfully and is now pending manager approval.
        
        Booking Details:
        Car: {car_brand} {car_model} ({car_reg})
        Destination: {booking.destination}
        Purpose: {booking.purpose}
        Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}
        End Time: {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.end_datetime else 'N/A'}
        Estimated KM: {booking.estimated_km} km
        Status: Pending Approval
        
        View your bookings: http://localhost:3000/my-bookings
        
        Thanks,
        Fleet Car Management Team
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee_email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Booking confirmation email sent to {employee_email}")
        
    except Exception as e:
        print(f"❌ Error sending booking confirmation email: {e}")
        logger.error(f"Failed to send booking confirmation email: {str(e)}")

def send_booking_approved_email(booking):
    """Send email when booking is approved"""
    subject = f'✅ Booking Approved'
    
    try:
        car = booking.car
        car_reg = car.registration_number if car else 'Unknown'
        car_brand = car.brand if car else 'Unknown'
        car_model = car.model if car else 'Unknown'
        
        employee = booking.employee
        employee_name = employee.get_full_name() or employee.username if employee else 'User'
        employee_email = employee.email if employee else ''
        comments = booking.manager_comments or ''
        
        if not employee_email:
            print("No employee email found, skipping email")
            return
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .booking-details {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .status-approved {{ background: #28a745; color: white; padding: 5px 10px; border-radius: 5px; display: inline-block; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>✅ Booking Approved!</h2>
                </div>
                <div class="content">
                    <h3>Hi {employee_name},</h3>
                    <p>Great news! Your car booking request has been <strong>APPROVED</strong>.</p>
                    
                    <div class="booking-details">
                        <h4>📋 Booking Details</h4>
                        <p><strong>Car:</strong> {car_brand} {car_model} ({car_reg})</p>
                        <p><strong>Destination:</strong> {booking.destination}</p>
                        <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}</p>
                        <p><strong>End Time:</strong> {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.end_datetime else 'N/A'}</p>
                        <p><strong>Status:</strong> <span class="status-approved">Approved</span></p>
                    </div>
                    
                    {f'<p><strong>Manager Comments:</strong> {comments}</p>' if comments else ''}
                    
                    <p><a href="http://localhost:3000/my-bookings">View My Bookings</a></p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Fleet Car Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Booking Approved
        
        Hi {employee_name},
        
        Great news! Your car booking request has been APPROVED.
        
        Booking Details:
        Car: {car_brand} {car_model} ({car_reg})
        Destination: {booking.destination}
        Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}
        End Time: {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.end_datetime else 'N/A'}
        Status: Approved
        
        {f'Manager Comments: {comments}' if comments else ''}
        
        View your bookings: http://localhost:3000/my-bookings
        
        Thanks,
        Fleet Car Management Team
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee_email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Booking approved email sent to {employee_email}")
        
    except Exception as e:
        print(f"❌ Error sending booking approved email: {e}")
        logger.error(f"Failed to send booking approved email: {str(e)}")

def send_booking_rejected_email(booking):
    """Send email when booking is rejected"""
    subject = f'❌ Booking Rejected'
    
    try:
        car = booking.car
        car_reg = car.registration_number if car else 'Unknown'
        car_brand = car.brand if car else 'Unknown'
        car_model = car.model if car else 'Unknown'
        
        employee = booking.employee
        employee_name = employee.get_full_name() or employee.username if employee else 'User'
        employee_email = employee.email if employee else ''
        comments = booking.manager_comments or ''
        
        if not employee_email:
            print("No employee email found, skipping email")
            return
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .booking-details {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .status-rejected {{ background: #dc3545; color: white; padding: 5px 10px; border-radius: 5px; display: inline-block; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>❌ Booking Rejected</h2>
                </div>
                <div class="content">
                    <h3>Hi {employee_name},</h3>
                    <p>We regret to inform you that your car booking request has been <strong>REJECTED</strong>.</p>
                    
                    <div class="booking-details">
                        <h4>📋 Booking Details</h4>
                        <p><strong>Car:</strong> {car_brand} {car_model} ({car_reg})</p>
                        <p><strong>Destination:</strong> {booking.destination}</p>
                        <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}</p>
                        <p><strong>Status:</strong> <span class="status-rejected">Rejected</span></p>
                    </div>
                    
                    {f'<p><strong>Reason:</strong> {comments}</p>' if comments else ''}
                    
                    <p><a href="http://localhost:3000/cars">Book Another Car</a></p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Fleet Car Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Booking Rejected
        
        Hi {employee_name},
        
        We regret to inform you that your car booking request has been REJECTED.
        
        Booking Details:
        Car: {car_brand} {car_model} ({car_reg})
        Destination: {booking.destination}
        Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}
        Status: Rejected
        
        {f'Reason: {comments}' if comments else ''}
        
        Book another car: http://localhost:3000/cars
        
        Thanks,
        Fleet Car Management Team
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee_email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Booking rejected email sent to {employee_email}")
        
    except Exception as e:
        print(f"❌ Error sending booking rejected email: {e}")
        logger.error(f"Failed to send booking rejected email: {str(e)}")

def send_trip_reminder_email(booking):
    """Send reminder email before trip starts"""
    subject = f'⏰ Trip Reminder'
    
    try:
        car = booking.car
        car_reg = car.registration_number if car else 'Unknown'
        car_brand = car.brand if car else 'Unknown'
        car_model = car.model if car else 'Unknown'
        
        employee = booking.employee
        employee_name = employee.get_full_name() or employee.username if employee else 'User'
        employee_email = employee.email if employee else ''
        
        if not employee_email:
            print("No employee email found, skipping email")
            return
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: #333; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .reminder-box {{ background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>⏰ Trip Reminder</h2>
                    <p>Your car booking starts soon!</p>
                </div>
                <div class="content">
                    <h3>Hi {employee_name},</h3>
                    <p>This is a reminder that your car booking starts in less than 1 hour.</p>
                    
                    <div class="reminder-box">
                        <h4>🚗 Trip Information</h4>
                        <p><strong>Car:</strong> {car_brand} {car_model} ({car_reg})</p>
                        <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}</p>
                        <p><strong>End Time:</strong> {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.end_datetime else 'N/A'}</p>
                        <p><strong>Destination:</strong> {booking.destination}</p>
                    </div>
                    
                    <p><a href="http://localhost:3000/my-bookings">Go to My Bookings</a></p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Fleet Car Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Trip Reminder - {car_reg}
        
        Hi {employee_name},
        
        This is a reminder that your car booking starts in less than 1 hour.
        
        Trip Information:
        Car: {car_brand} {car_model} ({car_reg})
        Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.start_datetime else 'N/A'}
        End Time: {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p') if booking.end_datetime else 'N/A'}
        Destination: {booking.destination}
        
        View your bookings: http://localhost:3000/my-bookings
        
        Thanks,
        Fleet Car Management Team
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee_email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Trip reminder email sent to {employee_email}")
        
    except Exception as e:
        print(f"❌ Error sending trip reminder email: {e}")
        logger.error(f"Failed to send trip reminder email: {str(e)}")

def send_maintenance_due_email(maintenance):
    """Send email when maintenance is due"""
    subject = f'🔧 Maintenance Due - {maintenance.car.registration_number}'
    
    try:
        car = maintenance.car
        car_reg = car.registration_number if car else 'Unknown'
        car_brand = car.brand if car else 'Unknown'
        car_model = car.model if car else 'Unknown'
        
        from accounts.models import User
        fleet_admins = User.objects.filter(role__in=['fleet_admin', 'super_admin'])
        recipient_emails = [admin.email for admin in fleet_admins if admin.email]
        
        if not recipient_emails:
            print("No fleet admin emails found to send maintenance notification")
            return
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .maintenance-box {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🔧 Maintenance Due</h2>
                    <p>Scheduled maintenance required</p>
                </div>
                <div class="content">
                    <h3>Fleet Admin,</h3>
                    <p>A vehicle requires scheduled maintenance.</p>
                    
                    <div class="maintenance-box">
                        <h4>🚗 Vehicle Information</h4>
                        <p><strong>Car:</strong> {car_brand} {car_model} ({car_reg})</p>
                        <p><strong>Maintenance Type:</strong> {maintenance.get_maintenance_type_display()}</p>
                        <p><strong>Scheduled Date:</strong> {maintenance.scheduled_date}</p>
                        <p><strong>Estimated Cost:</strong> ${maintenance.estimated_cost}</p>
                        <p><strong>Description:</strong> {maintenance.description}</p>
                    </div>
                    
                    <p><a href="http://localhost:3000/maintenance">View Maintenance</a></p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Fleet Car Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Maintenance Due - {car_reg}
        
        A vehicle requires scheduled maintenance.
        
        Vehicle Information:
        Car: {car_brand} {car_model} ({car_reg})
        Maintenance Type: {maintenance.get_maintenance_type_display()}
        Scheduled Date: {maintenance.scheduled_date}
        Estimated Cost: ${maintenance.estimated_cost}
        Description: {maintenance.description}
        
        View maintenance: http://localhost:3000/maintenance
        
        Thanks,
        Fleet Car Management System
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_emails,
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Maintenance due email sent to fleet admins")
        
    except Exception as e:
        print(f"❌ Error sending maintenance due email: {e}")
        logger.error(f"Failed to send maintenance due email: {str(e)}")

def send_welcome_email(user):
    """Send welcome email to new user"""
    subject = f'Welcome to Fleet Car Management System!'
    
    try:
        user_name = user.get_full_name() or user.username if user else 'User'
        user_email = user.email if user else ''
        
        if not user_email:
            print("No user email found, skipping email")
            return
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🚗 Welcome to Fleet Car Management!</h2>
                </div>
                <div class="content">
                    <h3>Hi {user_name},</h3>
                    <p>Thank you for joining Fleet Car Management System! Your account has been successfully created.</p>
                    
                    <h4>📋 Your Account Details:</h4>
                    <ul>
                        <li><strong>Username:</strong> {user.username}</li>
                        <li><strong>Email:</strong> {user.email}</li>
                        <li><strong>Role:</strong> {user.get_role_display()}</li>
                    </ul>
                    
                    <p><a href="http://localhost:3000/login">Login to Your Account</a></p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Fleet Car Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Welcome to Fleet Car Management System!
        
        Hi {user_name},
        
        Thank you for joining Fleet Car Management System! Your account has been successfully created.
        
        Your Account Details:
        Username: {user.username}
        Email: {user.email}
        Role: {user.get_role_display()}
        
        Login here: http://localhost:3000/login
        
        Thanks,
        Fleet Car Management Team
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"✅ Welcome email sent to {user_email}")
        
    except Exception as e:
        print(f"❌ Error sending welcome email: {e}")
        logger.error(f"Failed to send welcome email: {str(e)}")