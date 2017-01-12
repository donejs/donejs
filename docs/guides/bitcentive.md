@page bitcentive Example: Bitcentive
@parent DoneJS
@hide sidebar
@outline 2 ol
@description

In this guide, you'll learn how [Bitcentive](http://bitcentive.herokuapp.com) - an open source royalty program - works.
Specifically, this guide will walk through the implementation of the following behaviors or functionality:

 - Working with document-based data structures (MongoDB).
 - Registration, login, user sessions, and access rights with FeathersJS.
 - Using streams to manage state.

@body

## High Level Architecture

### Folder organization

### Data Model and Service Layer

### Component Map

## Document data structures

ContributionMonth is nested ... nice to operate on items individually.

### Relationships

 - Ref type

### Mutations on children

The DOM allows you to make changes without accessing the document.

`monthlyClientProject.save()` ... really need to call `contributionMonth.save()`.

How do you setup this relationship? `added` and `removed`.

What do you do if a `monthlyClientProject` is created without an associated
contributionMonth?

## Users, Sessions, and Access

### Behavior

### Responsibilities

## Streams

The hub and errors.
