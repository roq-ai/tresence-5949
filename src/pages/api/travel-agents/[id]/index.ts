import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { travelAgentValidationSchema } from 'validationSchema/travel-agents';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.travel_agent
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTravelAgentById();
    case 'PUT':
      return updateTravelAgentById();
    case 'DELETE':
      return deleteTravelAgentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTravelAgentById() {
    const data = await prisma.travel_agent.findFirst(convertQueryToPrismaUtil(req.query, 'travel_agent'));
    return res.status(200).json(data);
  }

  async function updateTravelAgentById() {
    await travelAgentValidationSchema.validate(req.body);
    const data = await prisma.travel_agent.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTravelAgentById() {
    const data = await prisma.travel_agent.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
