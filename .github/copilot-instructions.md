# AI Coding Agent Instructions

## Architecture Overview
This is an Express.js REST API server built with TypeScript, following an MVC-inspired structure:
- **Routes** (`src/routes/`): Define API endpoints and delegate to controllers
- **Controllers** (`src/controllers/`): Handle HTTP requests/responses, validate input
- **Services** (`src/services/`): Contain business logic, interact with models
- **Models** (`src/models/`): Mongoose schemas with TypeScript interfaces

Data flows: Route → Controller → Service → Model → MongoDB

## Key Patterns & Conventions

### Error Handling
Controllers catch errors and return consistent JSON responses:
```typescript
// Success response
res.status(200).json({
  success: true,
  data: result,
});

// Error response
res.status(400).json({
  success: false,
  message: error.message,
});
```

### Model Definitions
Use TypeScript interfaces with Mongoose schemas. Include timestamps and virtuals:
```typescript
export interface IUser extends Document {
  userId: string;
  name: string;
  // ... fields
}

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: [true, "Name is required"] },
    // ... fields
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual properties
userSchema.virtual("isAdult").get(function() {
  return this.age ? this.age >= 18 : false;
});

// Static methods
userSchema.statics.findByUserId = function(userId: string) {
  return this.findOne({ userId });
};
```

### Authentication
- Uses JWT tokens (access: 15min, refresh: 7d)
- Passwords hashed with bcryptjs (salt rounds: 10)
- Separate Auth model for credentials, User model for profiles
- AuthenticateUser linked to User via uuid field

### Services
Use static classes for business logic:
```typescript
export class UserService {
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
}
```

### Configuration
- Environment variables loaded via dotenv
- Constants in `src/config/constants.ts`
- Database connection in `src/config/database.ts` with event listeners

## Development Workflow

### Running the Server
```bash
npm run dev    # Development with nodemon (watches src/, ignores *.test.ts)
npm run build  # Compile TypeScript to dist/
npm run start  # Production (runs dist/server.js)
```

### Testing
- Jest configured for TypeScript
- Tests in `tests/` directory (currently empty)
- Use supertest for API testing

### Code Quality
- ESLint with TypeScript rules
- Prettier for formatting
- Husky for git hooks (lint-staged)

## Integration Points

### Database
- MongoDB with Mongoose ODM
- Connection string: `process.env.MONGO_URI`
- Models export both interface and model

### External Dependencies
- CORS enabled for all origins (commented config for localhost:3001)
- Helmet for security headers
- Morgan for request logging ("combined" format)
- Joi for validation (imported but usage patterns TBD)

### File Structure Reference
- `src/server.ts`: Entry point, connects DB and starts server
- `src/app.ts`: Express app setup, middleware, routes
- `src/routes/api.ts`: Main API router mounting sub-routes
- Health check endpoint: `GET /health`</content>
<parameter name="filePath">d:\my-node-server\.github\copilot-instructions.md