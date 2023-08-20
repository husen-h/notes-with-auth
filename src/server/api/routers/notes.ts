import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const notesByUser = await ctx.prisma.note.findMany({
      where: {
        authorId: userId,
      },
    });

    return notesByUser;
  }),
  createNote: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, content } = input;
      const authorId = ctx.session.user.id;
      const author = await ctx.prisma.user.findUnique({
        where: {
          id: authorId,
        },
      });

      if (!author) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }

      const newNote = await ctx.prisma.note.create({
        data: {
          title,
          content,
          authorId,
        },
      });

      return newNote;
    }),
});
