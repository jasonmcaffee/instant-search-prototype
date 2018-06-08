export class DataNotFoundError extends Error {
  constructor(){
    super();
    this.name = 'DataNotFoundError';
    this.message = message || 'Data not found';
    this.stack = (new Error()).stack;
  }
}

export class DataConflictError extends Error {
  constructor(){
    super();
    this.name = 'DataConflictError';
    this.message = message || 'Data Conflict';
    this.stack = (new Error()).stack;
  }
}

export class ForbiddenError extends Error{
  constructor(message){
    super();
    this.message = message || 'Forbidden';
    this.stack = (new Error()).stack;
    this.name = 'ForbiddenError';
  }
}

export class BadRequestError extends Error{
  constructor(message){
    super();
    this.message = message || 'BadRequest';
    this.stack = (new Error()).stack;
    this.name = 'BadRequestError';
  }
}