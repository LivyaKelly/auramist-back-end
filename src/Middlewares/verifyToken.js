import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // Tenta obter o token do cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'Token não fornecido.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Erro na verificação do token:', err);
      return res.status(403).json({
        auth: false,
        message: 'Falha na autenticação. Token inválido.'
      });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
};

export default verifyToken;
