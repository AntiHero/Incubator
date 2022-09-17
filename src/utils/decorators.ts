import { APIErrorResult, MetadataObj } from '../@types';

const FORMATS = { '$date-time': '$date-time ' } as const;

export function MaxLength (num: number) {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: string) {
        if (typeof arg !== 'string') return true;

        return (
          arg.length <= num || `Max length of ${num} characters is exceeded`
        );
      },
    });
  };
}

export function Max (num: number) {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: string) {
        if (typeof arg !== 'number') return true;

        return arg <= num || `Number is too large, should be less than ${num}`;
      },
    });
  };
}

export function MinLength (num: number) {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: string) {
        if (typeof arg !== 'string') return true;

        return (
          arg.length >= num ||
          `String is too small, should be ${num} characters minimum`
        );
      },
    });
  };
}

export function Min (num: number) {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: number) {
        if (typeof arg !== 'number') return true;

        return arg >= num || `Number is too small, should be more than ${num} `;
      },
    });
  };
}

export function NullableString () {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: string) {
        return (
          typeof arg === 'string' ||
          arg === null ||
          `Should be of type string or null`
        );
      },
    });
  };
}

export function NullableNumber () {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: number) {
        return (
          typeof arg === 'number' ||
          arg === null ||
          `Should be of type number or null`
        );
      },
    });
  };
}

export function Enum ({ collection }: { collection: Record<any, string> }) {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: string[]) {
        const values = Object.values(collection);

        for (const resolution in arg) {
          if (!values.includes(resolution))
            return `No valid resolution provided`;
        }

        return true;
      },
    });
  };
}

export function Number () {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: number) {
        return (
          (typeof arg === 'number' && !Object.is(arg, NaN)) ||
          `Should be of type number`
        );
      },
    });
  };
}

export function Boolean() {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: boolean) {
        return (
          typeof arg === 'boolean' ||
          `Should be of type boolean`
        );
      },
    });
  };
}

export function String () {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: string) {
        return typeof arg === 'string' || `Should be of type string or null`;
      },
    });
  };
}

export function Format ({
  format,
}: {
  format: typeof FORMATS[keyof typeof FORMATS];
}) {
  return (
    target: {
      [key: string | symbol]: any;
      metadata: Set<MetadataObj>;
    },
    propertyKey: string | symbol,
    parameterIndex: number
  ): void => {
    if (!target.metadata) {
      target.metadata = new Set();
    }

    target.metadata.add({
      name: propertyKey,
      parameterIndex,
      isValid (arg: string) {
        if (typeof arg !== 'string') return true;

        switch (format) {
          case FORMATS['$date-time']: {
            if (
              !/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(
                arg
              )
            )
              return `Date is not in a right format, ${FORMATS['$date-time']} should be used`;
            break;
          }
        }

        return true;
      },
    });
  };
}

export function Validate ({ errors }: { errors: APIErrorResult }) {
  return (
    target: {
      [key: string | symbol]: any;
      metadata?: Set<MetadataObj>;
    },
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const method = descriptor.value;

    if (!target.metadata) return;

    return ((descriptor.value = function (...rest: any): any {
      let noErrors = true;

      if (target.metadata) {
        for (const metaObj of target.metadata) {
          if (metaObj.name === propertyKey) {
            const result = metaObj.isValid(rest[metaObj.parameterIndex]);

            if (result !== true) {
              if (noErrors) noErrors = false;

              errors.errorsMessages.push({
                field: propertyKey,
                message: result,
              });
            }
          }
        }
      }

      if (!noErrors) throw new Error('Validation error');

      return method.apply(this, rest);
    }) as unknown) as typeof method;
  };
}
