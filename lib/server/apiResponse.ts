import { NextResponse }
from "next/server";

export function successResponse(
  data?: any
) {

  return NextResponse.json({

    success: true,

    data,

  });
}

export function errorResponse(
  message: string,
  status = 500
) {

  return NextResponse.json(

    {
      error: message,
    },

    {
      status,
    }

  );
}