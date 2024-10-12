export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
};

export const isAuthenticatedLogin = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        return res.status(401).json({ message: 'No autorizado' });
    }
};

export const hasRole = (roles) => { 
    return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) { 
        return res.status(403).json({ message: 'Acceso prohibido' });
    }
    next();
    };
};