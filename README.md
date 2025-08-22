# Interactive Web Builder

Overview

Interactive Web Builder is a full-stack web application that allows users to design and manage custom web pages in their own accounts. Users can log in, create or edit pages, and select from a variety of pre-built components with customizable styling.
The frontend is built with React (JSX), with a clean separation between pages, components, and associated stylesheets. The backend is powered by Express.js and uses MongoDB for persistent storage of users, components, and project data. All user passwords are securely encrypted.

In the future, this project could expand to support:

Automatic deployment of user-created pages

Multi-page projects under a single domain

Advanced collaboration features

Features

User Authentication – Secure login with encrypted passwords
Account Management – Each user can manage their own set of designed pages
Page Builder UI – Select from pre-built components and customize their styling
Component Library – Reusable React components with isolated CSS under /styles
Full-Stack Architecture – React frontend with Express + MongoDB backend

Tech Stack

Frontend:
React (JSX)
CSS Modules (organized under /styles)

Backend:
Node.js + Express
MongoDB (Mongoose ODM)
bcrypt (for password encryption)