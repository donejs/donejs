@page documenting Documenting Cookbook
@parent getstarted 3

Documentation is a critical step in creating maintainable code. 
It's often burdensome on developers and 
becomes neglected. JavaScriptMVC's integrates [DocumentJS] to make
it hard not to document your code. 

## Generating Documentation

Create the docs by running:

@codestart
> js cookbook/scripts/doc.js
@codeend


## Viewing Documentation

Open __cookbook/doc.html__ and you'll find something like:

<img src='http://wiki.javascriptmvc.com/wiki/images/2/27/Docs.png' />


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

 - code separation, 
 - testing, 
 - compression, and 
 - documentation. 
 
 This is pretty cool! Look at how simply you went from 
 nothing to a compressed, tested, and documented application.

