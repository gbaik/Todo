<% include head.ejs%>
<script> 
  var myUser = <%- JSON.stringify(user) %>
</script>   
 <div class="ui inverted vertical masthead segment" style="padding-bottom: 1em">
    <img id='navImg' class="ui centered circular tiny image" src="oc.png">
    <a href="/" class="active ui teal button small" style="margin-left: 3em">Home</a>
    <a href="/profile" class="ui teal button small">Profile</a>
    <a href="/friends" class="ui teal button small">Friends</a>
    <a href="/logout" class="ui teal button small" style="float: right; margin-right: 3em;">Logout</a>

  <div class="ui divider" color="#00b5ad"></div>
</div>  

<% include foot.ejs%>