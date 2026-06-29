import { Lead } from '../models/Lead.js';

const STATUS_VALUES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_VALUES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Get leads for the authenticated user with filtering, sorting, and pagination.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function getLeads(req, res, next) {
  try {
    const {
      status,
      source,
      search,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 20, 1);
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const filter = { owner: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (source && source !== 'All') {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: escapeRegex(search), $options: 'i' } },
        { company: { $regex: escapeRegex(search), $options: 'i' } },
        { email: { $regex: escapeRegex(search), $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};

      if (dateFrom) {
        const from = new Date(dateFrom);
        if (!Number.isNaN(from.getTime())) {
          filter.createdAt.$gte = from;
        }
      }

      if (dateTo) {
        const to = new Date(dateTo);
        if (!Number.isNaN(to.getTime())) {
          filter.createdAt.$lte = to;
        }
      }

      if (Object.keys(filter.createdAt).length === 0) {
        delete filter.createdAt;
      }
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      Lead.countDocuments(filter),
    ]);

    const pages = total > 0 ? Math.ceil(total / limitNumber) : 0;

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages,
        hasNext: pageNumber < pages,
        hasPrev: pageNumber > 1,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Create a new lead belonging to the authenticated user.
 */
export async function createLead(req, res, next) {
  try {
    const {
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
    } = req.body;

    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id,
    });

    return res.status(201).json({ success: true, data: lead });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get a single lead by id for the authenticated user.
 */
export async function getLeadById(req, res, next) {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update a lead for the authenticated user. Owner cannot be changed.
 */
export async function updateLead(req, res, next) {
  try {
    const updatePayload = { ...req.body };
    delete updatePayload.owner;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update only the status of a lead for the authenticated user.
 */
export async function updateLeadStatus(req, res, next) {
  try {
    const { status } = req.body;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return next(error);
  }
}

/**
 * Delete a lead owned by the authenticated user.
 */
export async function deleteLead(req, res, next) {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();

    return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get lead statistics and conversion metrics for the authenticated user using a single aggregation.
 */
export async function getLeadStats(req, res, next) {
  try {
    const ownerId = req.user._id;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const result = await Lead.aggregate([
      { $match: { owner: ownerId } },
      {
        $project: {
          status: 1,
          source: 1,
          createdAt: 1,
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          thisMonthLeads: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$year', currentYear] }, { $eq: ['$month', currentMonth] }] },
                1,
                0,
              ],
            },
          },
          lastMonthLeads: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$year', currentMonth === 1 ? currentYear - 1 : currentYear] }, { $eq: ['$month', currentMonth === 1 ? 12 : currentMonth - 1] }] },
                1,
                0,
              ],
            },
          },
          websiteCount: { $sum: { $cond: [{ $eq: ['$source', 'Website'] }, 1, 0] } },
          referralCount: { $sum: { $cond: [{ $eq: ['$source', 'Referral'] }, 1, 0] } },
          linkedInCount: { $sum: { $cond: [{ $eq: ['$source', 'LinkedIn'] }, 1, 0] } },
          coldCallCount: { $sum: { $cond: [{ $eq: ['$source', 'Cold Call'] }, 1, 0] } },
          emailCampaignCount: { $sum: { $cond: [{ $eq: ['$source', 'Email Campaign'] }, 1, 0] } },
          otherSourceCount: { $sum: { $cond: [{ $eq: ['$source', 'Other'] }, 1, 0] } },
          newCount: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          contactedCount: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
          meetingScheduledCount: { $sum: { $cond: [{ $eq: ['$status', 'Meeting Scheduled'] }, 1, 0] } },
          proposalSentCount: { $sum: { $cond: [{ $eq: ['$status', 'Proposal Sent'] }, 1, 0] } },
          wonCount: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lostCount: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalLeads: 1,
          thisMonthLeads: 1,
          lastMonthLeads: 1,
          statusBreakdown: {
            New: '$newCount',
            Contacted: '$contactedCount',
            'Meeting Scheduled': '$meetingScheduledCount',
            'Proposal Sent': '$proposalSentCount',
            Won: '$wonCount',
            Lost: '$lostCount',
          },
          sourceBreakdown: {
            Website: '$websiteCount',
            Referral: '$referralCount',
            LinkedIn: '$linkedInCount',
            'Cold Call': '$coldCallCount',
            'Email Campaign': '$emailCampaignCount',
            Other: '$otherSourceCount',
          },
          wonLeads: '$wonCount',
        },
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [{ $gt: ['$totalLeads', 0] }, { $round: [{ $multiply: [{ $divide: ['$wonLeads', '$totalLeads'] }, 100] }, 1] }, 0],
          },
          growthRate: {
            $cond: [
              { $gt: ['$lastMonthLeads', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [{ $subtract: ['$thisMonthLeads', '$lastMonthLeads'] }, '$lastMonthLeads'],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          totalLeads: 1,
          statusBreakdown: 1,
          sourceBreakdown: 1,
          thisMonthLeads: 1,
          lastMonthLeads: 1,
          conversionRate: 1,
          growthRate: 1,
        },
      },
    ]);

    const stats = result[0] || {
      totalLeads: 0,
      statusBreakdown: {
        New: 0,
        Contacted: 0,
        'Meeting Scheduled': 0,
        'Proposal Sent': 0,
        Won: 0,
        Lost: 0,
      },
      sourceBreakdown: {
        Website: 0,
        Referral: 0,
        LinkedIn: 0,
        'Cold Call': 0,
        'Email Campaign': 0,
        Other: 0,
      },
      thisMonthLeads: 0,
      lastMonthLeads: 0,
      conversionRate: 0,
      growthRate: 0,
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get monthly lead trends for the last six months.
 */
export async function getMonthlyStats(req, res, next) {
  try {
    const ownerId = req.user._id;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const aggregation = await Lead.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $project: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          status: 1,
        },
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const monthlyMap = aggregation.reduce((acc, item) => {
      const key = `${item._id.year}-${item._id.month}`;
      acc[key] = item;
      return acc;
    }, {});

    const monthlyStats = [];

    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthData = monthlyMap[key] || { total: 0, won: 0, lost: 0 };
      const conversionRate = monthData.total > 0 ? Number(((monthData.won / monthData.total) * 100).toFixed(1)) : 0;

      monthlyStats.push({
        month: `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`,
        total: monthData.total,
        won: monthData.won,
        lost: monthData.lost,
        conversionRate,
      });
    }

    return res.status(200).json({ success: true, data: monthlyStats });
  } catch (error) {
    return next(error);
  }
}

/**
 * Quick search leads for autocomplete or instantaneous lookup.
 */
export async function searchLeads(req, res, next) {
  try {
    const { q = '', limit = 5 } = req.query;
    const searchText = q.trim();
    const maxResults = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 20);

    const filter = { owner: req.user._id };

    if (searchText) {
      filter.$or = [
        { name: { $regex: escapeRegex(searchText), $options: 'i' } },
        { company: { $regex: escapeRegex(searchText), $options: 'i' } },
        { email: { $regex: escapeRegex(searchText), $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter, { name: 1, company: 1, email: 1, status: 1 })
      .limit(maxResults)
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    return next(error);
  }
}
