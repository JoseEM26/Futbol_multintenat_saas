export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  SESSION_EXPIRED: 'Tu sesión ha expirado o no es válida. Por favor, inicia sesión nuevamente.',
  FORBIDDEN_CUSTOMER_CREATE: 'Los clientes no tienen permiso para crear registros en este módulo.',
  FORBIDDEN_TENANT_ACCESS: 'No tienes permisos para acceder o modificar recursos de otra tienda.',
  CANCHA_NOT_FOUND: 'La cancha solicitada no fue encontrada.',
  RESERVATION_NOT_FOUND: 'La reserva solicitada no fue encontrada.',
  INTERNAL_SERVER_ERROR: 'Ocurrió un error interno en el servidor.',
  TENANT_REQUIRED: 'El identificador de la tienda (Tenant ID) es obligatorio.',
  INVALID_DATA: 'Los datos proporcionados no son válidos.',
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Registro creado exitosamente.',
  UPDATED: 'Registro actualizado exitosamente.',
  DELETED: 'Registro eliminado exitosamente.',
  FETCHED: 'Datos recuperados exitosamente.',
};
