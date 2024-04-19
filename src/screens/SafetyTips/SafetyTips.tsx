import * as React from 'react';
import SafeAreaPage from 'layouts/SafeAreaPage';
import Head from 'components/utilities/Head';
import MarkdownStyler from 'components/utilities/MarkdownStyler';

const SafetyTips = () => {
  return (
    <>
      <Head title="Safety Tips" description="Safety tips for using Bounce" />
      <SafeAreaPage isHideSidebar isIgnoreMobileTabs>
        <MarkdownStyler className="mx-auto max-w-main-content-container p-6">
          <h1>
            <strong>Safety Tips</strong>
          </h1>
          <p>
            Meeting new people to play tennis and pickleball is great, but you should always be
            careful when meeting up with someone you don’t know. Always keep your safety in mind,
            whether you are exchanging messages or actually meeting in person. Here are some things
            that you can do to help yourself say safe. These general suggestions cannot cover all
            possible situations that might arise, however, and in any particular situation you
            should always be guided by your best judgment.
          </p>
          <h2>
            <strong>Safety Online</strong>
          </h2>
          <h2>
            <strong>Protect Your Personal Information</strong>
          </h2>
          <p>
            Never share personal information - such as your home or work address, social security
            number, financial information, information about your family, or details about your job
            or daily routine - with anyone you don’t know.
          </p>
          <h2>
            <strong>Stay on the Site</strong>
          </h2>
          <p>
            Keep conversations with people you meet on the Bounce site on the site until you know
            someone well. People with bad intentions sometimes suggest immediately moving
            conversions off the site to texts, email, or phone.
          </p>
          <h2>
            <strong>Report Bad Behavior to Us</strong>
          </h2>
          <p>
            If someone engages in inappropriate, offensive or suspicious behavior, we want to know
            about it. Report anyone that violates our Terms of Use to us. Here are some examples of
            violations:
          </p>
          <ul>
            <li>Offensive messages</li>
            <li>Harassment, threats, bullying or intimidation</li>
            <li>Requests for money</li>
            <li>Fraud or deceit (including fraudulent profiles or impersonation)</li>
            <li>Attempts to sell products or services</li>
            <li>Illegal activities</li>
            <li>Use of the site by an underage person</li>
          </ul>
          <p>
            You can report any such violations or any other concerns about the other person’s
            behavior to us at <a href="mailto:team@bounce.game">team@bounce.game</a>.
          </p>
          <h2>
            <strong>Protect Your Account</strong>
          </h2>
          <p>
            Pick a strong password, protect it and change it regularly. Bounce will never send you
            an email or call you asking for your username or password. If you receive an email or
            call asking for your username or password or other information about your account,
            report it to us immediately at <a href="mailto:team@bounce.game">team@bounce.game</a>.
          </p>
          <p>
            <strong>Safety When You Meet to Play Tennis or Pickleball</strong>
          </p>
          <h2>
            <strong>Get to Know the Other Person before Meeting</strong>
          </h2>
          <p>
            Get to know the other person before agreeing to meet. Don’t be afraid to ask questions
            and don’t meet the person if you don’t like the answers. Use your judgment - if
            something feels wrong, cancel the meet-up and report the matter to us at{' '}
            <a href="mailto:team@bounce.game">team@bounce.game</a>.
          </p>
          <h2>
            <strong>Don’t Let the Other Person Drive You to Your Meet-up</strong>
          </h2>
          <p>
            You should drive yourself or take public transportation to your meet-up. Be wary if
            someone offers to pick you up and drive you.
          </p>
          <h2>
            <strong>Meet in Public and Stay in Public</strong>
          </h2>
          <p>
            Always meet in a public place — never at your home, the other person’s home or any other
            private location.
          </p>
          <h2>
            <strong>Bring Your Cell Phone</strong>
          </h2>
          <p>
            Make sure that you have your cell phone with you and make sure that it is fully charged.
          </p>
          <h2>
            <strong>Tell Someone About Your Plans</strong>
          </h2>
          <p>
            Tell a friend or family member about your meet-up plans, including where you’re going
            and when you expect to be home.
          </p>
          <h2>
            <strong>Don’t Leave Personal Items Unattended</strong>
          </h2>
          <p>
            Keep your phone, wallet, purse and anything containing personal information on you or in
            sight at all times. Make sure that your cell phone is locked.
          </p>
          <h2>
            <strong>If You Feel Uncomfortable, Leave</strong>
          </h2>
          <p>
            It’s okay to end your match early and leave if the other person is using offensive or
            harassing language or is acting in a threatening manner or even if something just
            doesn’t feel right. The reason doesn’t matter. You can report any concerns about the
            other person’s behavior to us at <a href="mailto:team@bounce.game">team@bounce.game</a>.
          </p>
        </MarkdownStyler>
      </SafeAreaPage>
    </>
  );
};

export default SafetyTips;
