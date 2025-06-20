import session from 'express-session';

const sessionMiddleware = session({
  secret: '$#QWER#$@W%R$#$%#$',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

export default sessionMiddleware;