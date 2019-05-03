@page survey Community Survey
@parent DoneJS
@hide sidebar

@description Help us improve CanJS, StealJS, and the rest of the DoneJS family
by taking a short email survey every six weeks.

@body

__We want to hear from you.__ What do you love and hate about CanJS, DoneJS, and
StealJS? What can the core team work on to make you grow fonder of these
projects?

<div class="cta">
  <a href="https://www.surveymonkey.com/r/bitovi-may-2019" target="_blank">
    Take the community survey
  </a>
</div>
<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script>
<script>
var endTime = new Date('May 8 2019 14:00:00 UTC');// 7 a.m. Pacific
if (new Date() < endTime) {// Survey has not yet ended
  var elements = document.getElementsByClassName('comment');
  var container = elements[0];
  if (container) {
    container.className = container.className + ' survey-is-active';
  }
} else {// Survey has ended
  hbspt.forms.create({
    css: '',
    portalId: '2171535',
    formId: '45da8caa-c096-4099-a444-450f5c303ba0'
  });
}
</script>

<div class="form-explanation">

Provide your email address (and optionally your GitHub username) above and
you’ll be signed up for our survey:

- You’ll receive an email about
[every six weeks](https://calendar.google.com/calendar/embed?src=jupiterjs.com_g27vck36nifbnqrgkctkoanqb4%40group.calendar.google.com)
with a link to the survey.
- Each survey will be about five questions and take just a few minutes to complete.
- An opt-out/unsubscribe link will be included in each email.

</div>

We will look at every single response and use it to prioritize what the team
works on in the coming months. Short of [hiring us](https://www.bitovi.com/contact)
to work on something in particular, __this is the best way to have a direct impact
on our priorities.__

<div class="youtube-embed" style="display: none">
  <p>Watch the discussion below to learn more about each item on the survey:</p>
  <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/UxBJtHm4Km0?start=55" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

[Read more about the survey in our announcement blog post.](https://www.bitovi.com/blog/help-us-improve-canjs-stealjs-and-the-rest-of-the-donejs-family)
If you have any questions, please don’t hesitate to ask on
[our forums](https://forums.bitovi.com/),
[Slack](https://www.bitovi.com/community/slack) ([#donejs channel](https://bitovi-community.slack.com/messages/CFC80DU5B)), or
[Twitter](https://twitter.com/donejs)

<figure>
    <img alt="Photo of the DoneJS core team" src="https://www.bitovi.com/hs-fs/hubfs/DoneJS%20core%20team%20photo%20(small).jpg?t=1505933448740&cos_cdn=1&width=2160&cos_cdn=1&name=DoneJS%20core%20team%20photo%20(small).jpg" />
    <figcaption>The core team thanks you for participating in our survey!</figcaption>
</figure>
