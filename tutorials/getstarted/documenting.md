@page documenting Documenting Cookbook
@parent getstarted 3

Documentation is a critical step in creating maintainable code. 
It's often burdensome on developers and 
becomes neglected. JavaScriptMVC's integrates [DocumentJS] to make
it hard not to document your code. 

## Generating Documentation

Create the docs by running:

@codestart
> js cookbook/scripts/docs.js
@codeend

_Note: Verify cookbook.html is not in production mode before running the above command._

## Viewing Documentation

Open __cookbook/doc.html__ and you'll find something like:

@image tutorials/getstarted/Docs.png


## Writing Documentation

The generated app comes with very minimal docs.  But, it 
gives you a great place to 
start.  Open __cookbook/cookbook.md__. This is the top level
page for the cookbook application.  Notice that it's markdown!

The syntax for documentation is very similar to JavaDoc.  However, there are some 
important differences.  Consult the [DocumentJS DocumentJS's documentation]
for more information.

## Next steps

In the context of this trivial application, you've 
been exposed to major features of JavaScriptMVC: 

 - code separation
 - testing
 - compression
 - documentation
 
 This is pretty cool! Look at how simply you went from 
 nothing to a compressed, tested, and documented application.

