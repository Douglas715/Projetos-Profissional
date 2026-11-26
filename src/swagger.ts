export const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "Course Management API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "List users",
        "responses": {
          "200": {
            "description": "Records"
          }
        }
      },
      "post": {
        "summary": "Create record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "status": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "email"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Invalid input"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      }
    },
    "/users/{id}": {
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "get": {
        "summary": "Find record",
        "responses": {
          "200": {
            "description": "Record"
          },
          "404": {
            "description": "Record not found"
          }
        }
      },
      "patch": {
        "summary": "Update record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "email": {
                    "type": "string"
                  },
                  "status": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated"
          },
          "400": {
            "description": "Invalid input"
          },
          "404": {
            "description": "Record not found"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      },
      "delete": {
        "summary": "Delete record",
        "responses": {
          "204": {
            "description": "Deleted"
          },
          "404": {
            "description": "Record not found"
          }
        }
      }
    },
    "/courses": {
      "get": {
        "summary": "List courses",
        "responses": {
          "200": {
            "description": "Records"
          }
        }
      },
      "post": {
        "summary": "Create record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "code": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string",
                    "nullable": true
                  },
                  "userId": {
                    "type": "string"
                  }
                },
                "required": [
                  "code",
                  "title",
                  "userId"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Invalid input"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      }
    },
    "/courses/{id}": {
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "get": {
        "summary": "Find record",
        "responses": {
          "200": {
            "description": "Record"
          },
          "404": {
            "description": "Record not found"
          }
        }
      },
      "patch": {
        "summary": "Update record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "code": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string",
                    "nullable": true
                  },
                  "userId": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated"
          },
          "400": {
            "description": "Invalid input"
          },
          "404": {
            "description": "Record not found"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      },
      "delete": {
        "summary": "Delete record",
        "responses": {
          "204": {
            "description": "Deleted"
          },
          "404": {
            "description": "Record not found"
          }
        }
      }
    },
    "/modules": {
      "get": {
        "summary": "List modules",
        "responses": {
          "200": {
            "description": "Records"
          }
        }
      },
      "post": {
        "summary": "Create record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "courseId": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string",
                    "nullable": true
                  },
                  "userId": {
                    "type": "string"
                  }
                },
                "required": [
                  "courseId",
                  "title",
                  "userId"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Invalid input"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      }
    },
    "/modules/{id}": {
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "get": {
        "summary": "Find record",
        "responses": {
          "200": {
            "description": "Record"
          },
          "404": {
            "description": "Record not found"
          }
        }
      },
      "patch": {
        "summary": "Update record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "courseId": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string",
                    "nullable": true
                  },
                  "userId": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated"
          },
          "400": {
            "description": "Invalid input"
          },
          "404": {
            "description": "Record not found"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      },
      "delete": {
        "summary": "Delete record",
        "responses": {
          "204": {
            "description": "Deleted"
          },
          "404": {
            "description": "Record not found"
          }
        }
      }
    },
    "/contents": {
      "get": {
        "summary": "List contents",
        "responses": {
          "200": {
            "description": "Records"
          }
        }
      },
      "post": {
        "summary": "Create record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "moduleId": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "content": {
                    "type": "string"
                  }
                },
                "required": [
                  "moduleId",
                  "title",
                  "content"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Invalid input"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      }
    },
    "/contents/{id}": {
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "get": {
        "summary": "Find record",
        "responses": {
          "200": {
            "description": "Record"
          },
          "404": {
            "description": "Record not found"
          }
        }
      },
      "patch": {
        "summary": "Update record",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "moduleId": {
                    "type": "string"
                  },
                  "title": {
                    "type": "string"
                  },
                  "content": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated"
          },
          "400": {
            "description": "Invalid input"
          },
          "404": {
            "description": "Record not found"
          },
          "409": {
            "description": "Duplicate"
          }
        }
      },
      "delete": {
        "summary": "Delete record",
        "responses": {
          "204": {
            "description": "Deleted"
          },
          "404": {
            "description": "Record not found"
          }
        }
      }
    },
    "/users/{userId}/watched/{contentId}": {
      "parameters": [
        {
          "name": "userId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "contentId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "put": {
        "summary": "Mark lesson as watched",
        "responses": {
          "200": {
            "description": "Watch record"
          },
          "400": {
            "description": "Related record does not exist"
          }
        }
      }
    },
    "/reports/users-most-courses": {
      "get": {
        "summary": "users most courses",
        "responses": {
          "200": {
            "description": "Report rows"
          }
        }
      }
    },
    "/reports/course-most-contents": {
      "get": {
        "summary": "course most contents",
        "responses": {
          "200": {
            "description": "Report rows"
          }
        }
      }
    },
    "/reports/courses-metrics": {
      "get": {
        "summary": "courses metrics",
        "responses": {
          "200": {
            "description": "Report rows"
          }
        }
      }
    },
    "/reports/contents-with-course": {
      "get": {
        "summary": "contents with course",
        "responses": {
          "200": {
            "description": "Report rows"
          }
        }
      }
    },
    "/reports/watched-content/{contentId}": {
      "parameters": [
        {
          "name": "contentId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      ],
      "get": {
        "summary": "watched content",
        "responses": {
          "200": {
            "description": "Report rows"
          }
        }
      }
    }
  }
}
