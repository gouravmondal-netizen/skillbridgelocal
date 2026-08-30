# LocalLink Connect

Develop an app of a good SDG  which should demonstrate not only the idea but also how the system works end-to-end. Below is a practical solution for building your website as an MVP (Minimum Viable Product) that can later be expanded into a full-scale platform.

Website Name

SkillBridge – Connecting Local Talent with Local Opportunities

Problem Statement

Many people looking for daily wage or short-term contractual jobs struggle to find nearby work, while startups, retail shops, and industries face difficulty finding qualified local workers quickly.

Our solution is a location-based employment platform that connects workers and employers within a 4–8 km radius, reducing unemployment, travel costs, and hiring time.

Website Architecture

                SkillBridge

                     │

     ┌───────────────┼────────────────┐

     │               │                │

 Worker Portal   Employer Portal   Admin Portal

Home Page

Navigation Bar

Home

Find Jobs

Hire Workers

Financial Assistance

Skill Training

About

Contact

Login/Register

Hero Section

Find Local Jobs Near You

Connect with employers within 4–8 km and get hired quickly.

Buttons

Find Jobs

Hire Workers

Background Image

Workers

Construction

Retail

Delivery

Factory

Worker Registration

The worker fills in:

Name

Age

Phone Number

Email

Location (GPS)

Qualification

Skills

Experience

Preferred Job Type

Daily Wage

Part Time

Contract (1–6 Months)

Expected Salary

Availability

Upload Photo

Upload Certificates

After registration:

Worker Dashboard

Worker Dashboard

Displays

Hello, Ravi

Nearby Jobs

My Applications

Job Status

Wallet

Ratings

Certificates

Profile

Settings

Nearby Jobs Page

Each card contains

Company Name

Job Title

Distance

Salary

Duration

Required Skills

Apply Button

Example

ABC Retail

Sales Assistant

2.8 km

₹18,000/month

3 Months

Apply

Filters

Distance

Salary

Skills

Job Type

Experience

Employer Registration

Company Name

Industry

Address

Location

Phone

Email

Company License

GST (Optional)

Company Size

Employer Dashboard

Post Job

Manage Jobs

View Applications

Hire Worker

Payments

Ratings

Analytics

Job Posting Form

Job Title

Description

Salary

Daily/Monthly

Duration

Required Skills

Qualification

Experience

Location

Vacancies

Start Date

End Date

Click

Publish Job

AI Matching Engine

When a job is posted

Job Posted

↓

Find workers within 8 km

↓

Compare Skills

↓

Compare Qualification

↓

Check Availability

↓

Rank Workers

↓

Send Notifications

Matching Formula

Score =

40% Skills

30% Distance

20% Experience

10% Ratings

Financial Assistance Page

Purpose

Help workers improve employability.

Sections

Government Schemes

PMKVY

Mudra Loan

Startup India

Skill India

Financial Literacy

Emergency Loan Information

Scholarships

Career Guidance

Skill Training Page

Courses

Electrician

Carpenter

Plumber

Retail Sales

Computer Basics

Digital Marketing

Data Entry

Tailoring

Each course contains

Description

Duration

Free/Paid

Certificate

Notification System

Worker receives

New Job Nearby

Company

Salary

Distance

Accept

Decline

Employer receives

5 New Applications

View Candidates

Wallet

Shows

Completed Jobs

Pending Payments

Total Earnings

Withdraw Money

Transaction History

Ratings

Worker rates employer

⭐⭐⭐⭐⭐

Employer rates worker

⭐⭐⭐⭐⭐

Comments

Admin Dashboard

Total Workers

Total Employers

Jobs Posted

Jobs Filled

Pending Approvals

Reports

Analytics

Database Structure

Worker Table

WorkerID

Name

Phone

Email

Latitude

Longitude

Qualification

Skills

Experience

Availability

Rating

Employer Table

EmployerID

Company

Industry

Latitude

Longitude

Rating

Jobs Table

JobID

EmployerID

JobTitle

Description

Salary

Duration

Location

RequiredSkills

Qualification

Status

Applications Table

ApplicationID

WorkerID

JobID

Status

DateApplied

Website Workflow

                     HOME PAGE

                          │

        ┌─────────────────┴─────────────────┐

        │                                   │

   Register as Worker                 Register as Employer

        │                                   │

        ▼                                   ▼

 Complete Profile                    Complete Company Profile

        │                                   │

        ▼                                   ▼

 AI Matches Nearby Jobs             Post New Job

        │                                   │

        └───────────────┬───────────────────┘

                        ▼

               Worker Receives Notification

                        │

                        ▼

                 Apply for the Job

                        │

                        ▼

             Employer Reviews Application

                        │

                Accept / Reject

                        │

                        ▼

                 Worker Starts Work

                        │

                        ▼

              Payment + Ratings + History

Recommended Technology Stack

ComponentTechnologyFrontendReact.js + Tailwind CSSBackendNode.js + Express.jsDatabaseMongoDBAuthenticationFirebase Authentication or JWTMapsGoogle Maps API or OpenStreetMap + LeafletNotificationsFirebase Cloud MessagingFile StorageCloudinary or Firebase StoragePaymentRazorpay or StripeDeploymentVercel (Frontend), Render/Railway (Backend), MongoDB Atlas (Database)

Additional Features to Make It Competition-Ready

Hyperlocal Search: Automatically display jobs within a 4–8 km radius using geolocation.

Skill Verification: Allow workers to upload certificates and earn verified skill badges.

One-Click Hiring: Employers can shortlist and hire workers directly from the dashboard.

AI Job Recommendations: Suggest jobs based on skills, experience, location, and previous work.

Multilingual Support: English, Hindi, Kannada, Tamil, Telugu, and Bengali to improve accessibility.

Offline Mode: Save job listings for viewing without an internet connection.

Emergency Hiring: Businesses can post urgent same-day job requests that trigger instant notifications.

Analytics Dashboard: Visualize employment trends, successful hires, and platform impact for SDG reporting.

Why this website is strong for an SDG 8 project

Unlike traditional job portals, this platform focuses on hyperlocal, short-term, and daily wage employment. It reduces travel costs, speeds up hiring for small businesses, supports workers with financial and skill-development resources, and promotes inclusive economic growth—all of which directly support Sustainable Development Goal 8: Decent Work and Economic Growth.

This design is comprehensive enough to be developed as a working prototype for a college hackathon or SDG competition while remaining scalable into a production-ready platform.

things to include: 

1. GPS interface for both the employers and employees 

2. weekend job opportunities for both skilled and unskilled 

3. Customer care portal 

4. Batches for both employees and Employer based on the skills.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://skillbridgelocal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f4ee4f5a-f8f6-4fab-b8ea-1fe621826a42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
