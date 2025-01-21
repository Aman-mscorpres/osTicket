const express = require("express");
const router = express.Router();
let { MainDB } = require("../../CONFIGS/db");
const auth = require("../../MIDDLEWARES/auth");
const Validator = require("validatorjs");
var bcrypt = require("bcryptjs");
const helper = require("../../HELPERS/index");

// GET TICKET LIST
router.get("/ticketList", [auth.isAuthorized], async (req, res, next) => {
  try {
    let stmt = await MainDB.query(
      `SELECT 
        ost_ticket.number,
        ost_ticket.lastUpdate , 
        ost_ticket__cdata.subject, 
        ost_ticket__cdata.priority,
        ost_user.name
       FROM ost_ticket 
       LEFT JOIN ost_ticket__cdata 
       ON ost_ticket.ticket_id = ost_ticket__cdata.ticket_id
       LEFT JOIN ost_user 
       ON ost_ticket.user_id = ost_user.id`,
      {
        type: MainDB.QueryTypes.SELECT,
      }
    );

    let arr = [];
    if (stmt.length > 0) {
      for (let j = 0; j < stmt.length; j++) {
        arr.push({
          id: stmt[j].number,
          name: stmt[j].name,
          lastUpdate: stmt[j].lastUpdate,
          sub: stmt[j].subject,
          Priority: stmt[j].priority,
        });
      }
    }

    return res.json({ code: 200, status: "success", data: arr });
  } catch (err) {
    next(err);
    helper.crashRes(res, err, { routeName: "ticketList" });
  }
});

//create ticket
router.post("/createTicket", async (req, res, next) => {
  try {
    const validation = new Validator(req.body, {
      email: "required|email",
      phone: "string",
      name: "required|string",
      subject: "required|string",
      message: "required|string",
      priority: "required|string",
      topic: "required|integer",
    });

    if (validation.fails()) {
      return res.status(400).json({
        success: false,
        message: helper.firstErrorValidatorjs(validation),
      });
    }

    const { email, name, subject, message, priority, phone, topic } = req.body;

    const transaction = await MainDB.transaction();

    try {
      
      const [topicData] = await MainDB.query(
        `SELECT topic_id, staff_id FROM ost_help_topic WHERE topic_id = :topicId`,
        {
          replacements: { topicId: topic },
          type: MainDB.QueryTypes.SELECT,
          transaction,
        }
      );

      if (!topicData) {
        return res.status(400).json({
          success: false,
          message: "Invalid topic selected.",
        });
      }

      const { topic_id: topicId, staff_id: staffId } = topicData;

      let user = await MainDB.query(
        "SELECT * FROM ost_user WHERE name = :name",
        {
          replacements: { name },
          type: MainDB.QueryTypes.SELECT,
          transaction,
        }
      );

      let userId;

      if (user.length === 0) {
        const [newUser] = await MainDB.query(
          "INSERT INTO ost_user (org_id, default_email_id, status, name, created, updated) VALUES (0, 0, 1, :name, NOW(), NOW())",
          {
            replacements: { name },
            type: MainDB.QueryTypes.INSERT,
            transaction,
          }
        );

        userId = newUser;

        await MainDB.query(
          "INSERT INTO ost_user__cdata (user_id, email, phone) VALUES (:userId, :email, :phone)",
          {
            replacements: { userId, email, phone: phone || null },
            type: MainDB.QueryTypes.INSERT,
            transaction,
          }
        );
      } else {
        userId = user[0].id;
      }

      const [ticket] = await MainDB.query(
        `INSERT INTO ost_ticket 
          (ticket_pid, number, user_id, status_id, dept_id, sla_id, topic_id, staff_id, team_id, source, created, updated) 
         VALUES 
          (NULL, FLOOR(RAND() * 1000000), :userId, 1, 1, 1, :topicId, :staffId, 0, 'Web', NOW(), NOW())`,
        {
          replacements: { userId, topicId, staffId },
          type: MainDB.QueryTypes.INSERT,
          transaction,
        }
      );

      const ticketId = ticket;

      await MainDB.query(
        `INSERT INTO ost_ticket__cdata (ticket_id, subject, priority) 
         VALUES (:ticketId, :subject, :priority)`,
        {
          replacements: { ticketId, subject, priority: priority || "4" },
          type: MainDB.QueryTypes.INSERT,
          transaction,
        }
      );

      //insert into ost_thread

    const [thread]= await MainDB.query(
        `INSERT INTO ost_thread (object_id, object_type,  lastmessage, created) 
         VALUES (:objectId, 'T', NOW(), NOW())`,
        {
          replacements: { objectId : ticket, objectType: "T" },
          type: MainDB.QueryTypes.INSERT,
          transaction,
        }
      );

      await MainDB.query(
        `INSERT INTO ost_thread_entry (user_id, thread_id, staff_id, type, body, format, source, ip_address, created, updated)
         VALUES (:userId, :threadId, :staffId, 'M', :body, 'html', 'Web', :ipAddress, NOW(), NOW())`,
        {
          replacements: {
            
            userId,
            threadId: thread,
            staffId: staffId,
            body: message,
            ipAddress: req.ip || "127.0.0.1",
          },
          type: MainDB.QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      return res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        ticketId,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    helper.crashRes(res, err, { routeName: "createTicket" });
    next(err);
  }
});


//get topic list
router.get("/topicList", [auth.isAuthorized], async (req, res, next) => {
  try {
    let stmt = await MainDB.query(`SELECT topic_id, topic FROM ost_help_topic`, {
      type: MainDB.QueryTypes.SELECT,
    }); 

    return res.json({ success: true, data: stmt });
  } catch (err) {
    next(err);
    helper.crashRes(res, err, { routeName: "topicList" });
  }
});


// get department list

router.get("/departmentList", [auth.isAuthorized], async (req, res, next) => {
  try { 
    let stmt = await MainDB.query(`SELECT id, name FROM ost_help_department`, {
      type: MainDB.QueryTypes.SELECT,
    });

    return res.json({ success: true, data: stmt });
  } catch (err) {
    next(err);
    helper.crashRes(res, err, { routeName: "departmentList" });
  }
});


module.exports = router;
