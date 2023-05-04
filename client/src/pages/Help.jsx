import React from 'react'
import Cookies from 'js-cookie'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import iiii from './YMCA-Logo-2010.png'

const Help = () => {
  return (
    <div>
      {(!document.cookie || JSON.parse(Cookies.get('user_id')).private!=2) ?
        (<header>
            <div class="container">
                  <div class="row">
                      <div class="col-sm">
                      <a href="/"><img src={iiii} height='100px' style={{verticalAlign:"baseline"}}></img></a>
                      </div>
                      <div class="col-sm">
                      <a href="/programs/">Programs</a>
                      </div>
                      <div class="col-sm">
                      <a href="/about/">Help</a>
                      </div>
                      <div class="col-sm">
                      {
                          document.cookie ? <a href='/'>Welcome, {Cookies.get('new_family_name')}</a> : <a href="/">Sign Up  or Log In!</a>
                      }
                      </div>
                      <div class="col-sm">
                      {
                          document.cookie ? <a href="/Logout/">Logout</a> : <div></div>
                      }
                      </div>
                      <div class="col-sm">
                      {
                          document.cookie ? <a href="/DeleteAccount/">Delete Account</a> : <div></div>
                      }
                      </div>
                  </div>
            </div>
        </header>)
        :
        (<header>
            <div class="container">
                    <div class="row">
                        <div class="col-sm">
                        <a href="/AdminHome"><img src={iiii} height='100px' style={{verticalAlign:"baseline"}}></img></a>
                        </div>
                        <div class="col-sm">
                        <a href="/AdminProgram/">Programs</a>
                        </div>
                        <div class="col-sm">
                        <a href="/Registrations/">Registrations</a>
                        </div>
                        <div class="col-sm">
                        <a href="/about/">Help</a>
                        </div>
                        <div class="col-sm">
                        {
                            document.cookie ? <a href='/AdminHome'>Welcome, {Cookies.get('new_family_name')}</a> : <a href="/AdminHome">Sign Up  or Log In!</a>
                        }
                        </div>
                        <div class="col-sm">
                        {
                            document.cookie ? <a href="/Users/">Users</a> : <div></div>
                        }
                        </div>
                        <div class="col-sm">
                        {
                            document.cookie ? <a href="/Logout/">Logout</a> : <div></div>
                        }
                        </div>

                    </div>
            </div>

        </header>)}

      {!document.cookie ?
        <div>
          <div><h1>How To Create An Account</h1></div>
          <div>
            To create an account, go to the home page, and fill in
        the email, username, first name, last name, and password fields directly below "Sign Up!". Then click the "submit" button beneath that to
            create an account with the supplied info. NOTE: If an account with the provided email already exists, you won't be able to create a new one.
          </div>
          <div><h1>How To Log In</h1></div>
          <div>
            If you have an existing account, you can log in on the home page by entering the email and password associated with the account in the fields below "Log In!", the click the submitted
            button below that
          </div>
        </div>:<span></span>
      }
      <div>
        <div>
          <h1>
          Program Search
          </h1>
        </div>
        <div>
          If you go to the programs page, you can view all the different programs the YMCA has on offer. To make finding classes easier, you have the ability to search the programs based on
          various paramaters. The paramter you can search by is displayed above the search boxes. Some searches will look for keywords included in your search, while others will
          return all programs that are equal to or greater/less than the value you searched for. Look at the labels to get an idea of what they will do. For the checkmark boxes, simply toggling them on
          or off will result in them filtering. NOTE: The starting and end dates, starting and end times, and which days the programs meet are some of the values listed on the programs page. NOTE: if you fill multiple search
          feilds, they'll all be applied to the search.
        </div>
      </div>

      {document.cookie && JSON.parse(Cookies.get('user_id')).private==2 ?
        <div>
          <div><h1>Other Searches</h1></div>
          <div>
            Admins can not enroll in programs, but can look at and search the programs, users, and registrations databases. The search features are mostly the same, except some paramaters have two check boxes: you must check the top box
            to begin filtering, and the second box toggles which values are filtered out.
          </div>
          <div><h1>Hard Delete</h1></div>
          <div>
            Admins have the ability to completely delete a user's account after said account has been soft deleted. To do this, go to "Users", find the account to delete, and then click the HARD DELETE button next to their info.
          </div>
      </div>:<span></span>}

      {document.cookie && JSON.parse(Cookies.get('user_id')).private!=2 ?
      <div>
        <div><h1>Enrolling In Programs</h1></div>
        <div>
          To enroll in a program, go to the Programs page, find the program you'd like to enroll in, and click the "Enroll" button. You will be taken to another page. If you are Currently
          enrolled in a different program that is held at the same time as the one you're attempting to enroll in, then you'll get an error at this time. You'll be shown the problematic enrollment(s), and be given the options
          to either drop all problematic enrollments, or to just not enroll in the new program. If there are no conflicts, you'll be told that all's good, and given the options to confirm enrollment, or to cancel it. Note
          that you can't enroll in programs that are currently at max capacity, or canceled.
        </div>
        <div><h1>Canceled Programs</h1></div>
        <div>
          You can't enroll in canceled programs. These programs will have a line going through them. If a program you're enrolled in gets canceled, you'll get a notice on your user dashboard, and it will be striked through
          on your schedule.
        </div>
      </div>:<span></span>}

      {document.cookie && JSON.parse(Cookies.get('user_id')).private==1 ?
        <div>
          For staff, enrollment is basically the same, except if the conflict occures with a program that the staff member is hosting, there will be no option
          to drop the conflicts. They'll have to be canceled from the home page.
        </div>:<span></span>
      }

      {document.cookie && JSON.parse(Cookies.get('user_id')).private==0 ?
      <div>
        <div><h1>User Dashboard</h1></div>
        <div>
          After you've logged in, you'll be brought to the user dashboard. From here, you can check the information onf what programs you're enrolled in or drop out of them, change your membership status, or convert your account
          to a family account and add members.
        </div>
        <div><h1>Family accounts</h1></div>
        <div>
          Family members all share one memberment and password, while being able to enroll in their own choice of programs. To create a family account, click on the "Family" tab of the user dashboard, and then click "create family".
          A text box and button will appear on the left, saying "Add family member". If you input a name into the text box and then click this button, a new family member will be added to the account, with a maximum of 7 members. To
          switch between family members, click the buttons on the right of the tab. Each family member's name will be displayed, so just select the one with the name you want to sign up with, and you're good to go. You'll also need to select
          each family member to see that member's schedule of programs.
        </div>
        <div><h1>Memberships</h1></div>
        <div>
          YMCA Members get a discount on programs. That's it. You can view or change your membership status by going to your user dashboard, and clicking on the "Membership" tab.
        </div>
        <div><h1>Schedule and Dropping Programs</h1></div>
        <div>
          To view what programs you're enrolled in, when they're held, and their cost, go to your user dashboard and open the "Schedule" tab. You can also drop out of programs from here by clicking the "Drop class!" button next
          to the program's info.
        </div>
      </div>:<span></span>
    }

      {document.cookie && JSON.parse(Cookies.get('user_id')).private==1 ?
        <div>
          <div><h1>User Dashboard</h1></div>
          <div>
            From the user dashboard, you can create new programs, check and cancel your own programs, and view or drop out of programs you're enrolled in.
          </div>
          <div><h1>Creating Programs</h1></div>
          <div>
            To create a new program, go to your user dashboard, and click the "Create NEW class" tab. This will give you a few text fields.
            You'll have to set the program's name, description, max capacity, base and member price, start and end dates and times, and which days of the
            week that the program will be held on. Every feild MUST be filled before you can create the program. Note that you can't create that begin at
            an earlier date than the current one, and that you can't create a program with the start date or time later than the end one. Finally, if the program you already
            creating would conflict with any programs you are currently enrolled in or hosting, you won't be able to create the program.
          </div>
          <div><h1>Your Programs and Canceling</h1></div>
          <div>
            By clicking on the "Created classes" tab of the user dashboard, you can see the scheule of programs you're hosting, how many people are in them, and their costs. You can
            also cancel your programs from here, by clicking on the "cancel" button to the right of each program. Canceled programs cannot be recovered.
          </div>
          <div><h1>Schedule and Dropping Programs</h1></div>
          <div>
            To view what programs you're enrolled in, when they're held, and their cost, go to your user dashboard and open the "Schedule" tab. You can also drop out of programs from here by clicking the "Drop class!" button next
            to the program's info.
          </div>
        </div>:<span></span>
      }

      <div>
        <div>
          <h1>
            Logging Out
          </h1>
        </div>
        <div>
          To log out, click "Log Out" in the strip across the top of the page.
        </div>
      </div>

      <div>
        <div>
          <h1>
            Deleting Your Account
          </h1>
        </div>
        <div>
          You can perform a soft delete of your account by clicking the "Delete Account" link in the top left of the page. Once you've deleted your account, you'll be dropped from all of your currently enrolled programs,
          and you won't be able to log back into your account anymore.
        </div>
      </div>

    </div>
  )
}

export default Help
