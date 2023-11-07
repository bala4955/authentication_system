exports.enumValidator = (Enum) => {
    return {
      validator: (v) => {
        return v != null ? Enum.includes(v) : true;
      },
      message: `value shoud be ${Enum}`,
    };
};