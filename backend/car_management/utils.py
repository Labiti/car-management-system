from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_booking_confirmation_email(booking):
    """Send email when booking is submitted"""
    # Get car details properly
    car = booking.car  # This gets the actual Car object
    employee = booking.employee  # This gets the User object
    
    subject = f'Booking Request Submitted - {car.registration_number}'
    
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
                <h3>Hi {employee.get_full_name() or employee.username},</h3>
                <p>Your car booking request has been submitted successfully and is now pending manager approval.</p>
                
                <div class="booking-details">
                    <h4>📋 Booking Details</h4>
                    <p><strong>Car:</strong> {car.brand} {car.model} ({car.registration_number})</p>
                    <p><strong>Destination:</strong> {booking.destination}</p>
                    <p><strong>Purpose:</strong> {booking.purpose}</p>
                    <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>End Time:</strong> {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
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
    Booking Request Submitted - {car.registration_number}
    
    Hi {employee.get_full_name() or employee.username},
    
    Your car booking request has been submitted successfully and is now pending manager approval.
    
    Booking Details:
    Car: {car.brand} {car.model} ({car.registration_number})
    Destination: {booking.destination}
    Purpose: {booking.purpose}
    Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}
    End Time: {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p')}
    Status: Pending Approval
    
    You will receive another email once your manager reviews the request.
    
    View your bookings: http://localhost:3000/my-bookings
    
    Thanks,
    Fleet Car Management Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Booking confirmation email sent to {employee.email}")
        print(f"✅ Booking confirmation email sent to {employee.email}")
    except Exception as e:
        logger.error(f"Failed to send booking confirmation email: {str(e)}")
        print(f"❌ Error sending email: {e}")

def send_booking_approved_email(booking):
    """Send email when booking is approved"""
    car = booking.car
    employee = booking.employee
    comments = booking.manager_comments or ''
    
    subject = f'✅ Booking Approved - {car.registration_number}'
    
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
            .comments {{ background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 15px; }}
            .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>✅ Booking Approved!</h2>
            </div>
            <div class="content">
                <h3>Hi {employee.get_full_name() or employee.username},</h3>
                <p>Great news! Your car booking request has been <strong>APPROVED</strong>.</p>
                
                <div class="booking-details">
                    <h4>📋 Booking Details</h4>
                    <p><strong>Car:</strong> {car.brand} {car.model} ({car.registration_number})</p>
                    <p><strong>Destination:</strong> {booking.destination}</p>
                    <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>End Time:</strong> {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>Status:</strong> <span class="status-approved">Approved</span></p>
                </div>
                
                {f'<div class="comments"><strong>📝 Manager\'s Comments:</strong><p>{comments}</p></div>' if comments else ''}
                
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
    Booking Approved - {car.registration_number}
    
    Hi {employee.get_full_name() or employee.username},
    
    Great news! Your car booking request has been APPROVED.
    
    Booking Details:
    Car: {car.brand} {car.model} ({car.registration_number})
    Destination: {booking.destination}
    Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}
    End Time: {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p')}
    Status: Approved
    
    {f'Manager Comments: {comments}' if comments else ''}
    
    View your bookings: http://localhost:3000/my-bookings
    
    Thanks,
    Fleet Car Management Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Booking approved email sent to {employee.email}")
        print(f"✅ Booking approved email sent to {employee.email}")
    except Exception as e:
        logger.error(f"Failed to send booking approved email: {str(e)}")
        print(f"❌ Error sending email: {e}")

def send_booking_rejected_email(booking):
    """Send email when booking is rejected"""
    car = booking.car
    employee = booking.employee
    comments = booking.manager_comments or ''
    
    subject = f'❌ Booking Rejected - {car.registration_number}'
    
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
            .reason {{ background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 15px; }}
            .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>❌ Booking Rejected</h2>
            </div>
            <div class="content">
                <h3>Hi {employee.get_full_name() or employee.username},</h3>
                <p>We regret to inform you that your car booking request has been <strong>REJECTED</strong>.</p>
                
                <div class="booking-details">
                    <h4>📋 Booking Details</h4>
                    <p><strong>Car:</strong> {car.brand} {car.model} ({car.registration_number})</p>
                    <p><strong>Destination:</strong> {booking.destination}</p>
                    <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>Status:</strong> <span class="status-rejected">Rejected</span></p>
                </div>
                
                {f'<div class="reason"><strong>📝 Reason for Rejection:</strong><p>{comments}</p></div>' if comments else ''}
                
                <p>You can submit a new booking request with different dates or contact your manager.</p>
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
    Booking Rejected - {car.registration_number}
    
    Hi {employee.get_full_name() or employee.username},
    
    We regret to inform you that your car booking request has been REJECTED.
    
    Booking Details:
    Car: {car.brand} {car.model} ({car.registration_number})
    Destination: {booking.destination}
    Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}
    Status: Rejected
    
    {f'Reason: {comments}' if comments else ''}
    
    You can submit a new booking request: http://localhost:3000/cars
    
    Thanks,
    Fleet Car Management Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Booking rejected email sent to {employee.email}")
        print(f"✅ Booking rejected email sent to {employee.email}")
    except Exception as e:
        logger.error(f"Failed to send booking rejected email: {str(e)}")
        print(f"❌ Error sending email: {e}")

def send_trip_reminder_email(booking):
    """Send reminder email before trip starts"""
    car = booking.car
    employee = booking.employee
    
    subject = f'⏰ Trip Reminder - {car.registration_number}'
    
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
                <h3>Hi {employee.get_full_name() or employee.username},</h3>
                <p>This is a reminder that your car booking starts in less than 1 hour.</p>
                
                <div class="reminder-box">
                    <h4>🚗 Trip Information</h4>
                    <p><strong>Car:</strong> {car.brand} {car.model} ({car.registration_number})</p>
                    <p><strong>Start Time:</strong> {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>End Time:</strong> {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
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
    Trip Reminder - {car.registration_number}
    
    Hi {employee.get_full_name() or employee.username},
    
    This is a reminder that your car booking starts in less than 1 hour.
    
    Trip Information:
    Car: {car.brand} {car.model} ({car.registration_number})
    Start Time: {booking.start_datetime.strftime('%B %d, %Y at %I:%M %p')}
    End Time: {booking.end_datetime.strftime('%B %d, %Y at %I:%M %p')}
    Destination: {booking.destination}
    
    View your bookings: http://localhost:3000/my-bookings
    
    Thanks,
    Fleet Car Management Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[employee.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Trip reminder email sent to {employee.email}")
        print(f"✅ Trip reminder email sent to {employee.email}")
    except Exception as e:
        logger.error(f"Failed to send trip reminder email: {str(e)}")
        print(f"❌ Error sending email: {e}")

def send_maintenance_due_email(maintenance):
    """Send email when maintenance is due"""
    car = maintenance.car
    
    subject = f'🔧 Maintenance Due - {car.registration_number}'
    
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
                    <p><strong>Car:</strong> {car.brand} {car.model} ({car.registration_number})</p>
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
    Maintenance Due - {car.registration_number}
    
    A vehicle requires scheduled maintenance.
    
    Vehicle Information:
    Car: {car.brand} {car.model} ({car.registration_number})
    Maintenance Type: {maintenance.get_maintenance_type_display()}
    Scheduled Date: {maintenance.scheduled_date}
    Estimated Cost: ${maintenance.estimated_cost}
    Description: {maintenance.description}
    
    View maintenance: http://localhost:3000/maintenance
    
    Thanks,
    Fleet Car Management System
    """
    
    from accounts.models import User
    fleet_admins = User.objects.filter(role__in=['fleet_admin', 'super_admin'])
    recipient_emails = [admin.email for admin in fleet_admins if admin.email]
    
    if not recipient_emails:
        print("No fleet admin emails found to send maintenance notification")
        return
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_emails,
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Maintenance due email sent to fleet admins")
        print(f"✅ Maintenance due email sent to fleet admins")
    except Exception as e:
        logger.error(f"Failed to send maintenance due email: {str(e)}")
        print(f"❌ Error sending email: {e}")

def send_welcome_email(user):
    """Send welcome email to new user"""
    subject = f'Welcome to Fleet Car Management System!'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
            .button {{ background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }}
            .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🚗 Welcome to Fleet Car Management!</h2>
            </div>
            <div class="content">
                <h3>Hi {user.get_full_name() or user.username},</h3>
                <p>Thank you for joining Fleet Car Management System! Your account has been successfully created.</p>
                
                <h4>📋 Your Account Details:</h4>
                <ul>
                    <li><strong>Username:</strong> {user.username}</li>
                    <li><strong>Email:</strong> {user.email}</li>
                    <li><strong>Role:</strong> {user.get_role_display()}</li>
                </ul>
                
                <p style="text-align: center;">
                    <a href="http://localhost:3000/login" class="button">Login to Your Account</a>
                </p>
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
    
    Hi {user.get_full_name() or user.username},
    
    Thank you for joining Fleet Car Management System! Your account has been successfully created.
    
    Your Account Details:
    Username: {user.username}
    Email: {user.email}
    Role: {user.get_role_display()}
    
    Login here: http://localhost:3000/login
    
    Thanks,
    Fleet Car Management Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Welcome email sent to {user.email}")
        print(f"✅ Welcome email sent to {user.email}")
    except Exception as e:
        logger.error(f"Failed to send welcome email: {str(e)}")
        print(f"❌ Error sending email: {e}")