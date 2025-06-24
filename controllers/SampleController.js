const Sample = require("../models/Sample");

const fs = require("fs");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

module.exports = class SampleController {
  static async selectImportGet(req, res) {
    const samples = await Sample.findAll();

    let importIdsArray = [];
    for (let sample of samples) {
      if (!importIdsArray.includes(sample.dataValues.importId)) {
        importIdsArray.push(sample.dataValues.importId);
      }
    }

    res.render("sample/selectImport", { importIdsArray });
  }

  static async listSamples(req, res) {
    const search = req.query.search;

    let queryOptions = {
      where: {
        ...(search && {
          name: {
            [Op.like]: `%${search}%`,
          },
        }),
      },
      raw: true,
    };

    const samplesData = await Sample.findAll(queryOptions);

    const samples = samplesData.map((result) => result.get({ plain: true }));

    res.render("sample/list", { samples });
  }

  static async deleteSample(req, res) {
    await Sample.destroy({ where: { id: req.body.id } });

    res.redirect("/sample/list");
  }

  static async editSampleGet(req, res) {
    const sample = await Sample.findOne({
      raw: true,
      where: { id: req.params.id },
    });
    const projects = await Project.findAll({ raw: true });

    res.render("sample/edit", { sample, projects });
  }

  static async editSamplePost(req, res) {
    const id = req.body.id;

    const sample = await Sample.findOne({ raw: true, where: { id: id } });

    const variableData = {};

    for (const key in req.body) {
      variableData[key] = req.body[key];
    }

    const dateArray = variableData.date.split("-");
    variableData.date = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;

    sample.data = {
      ...sample.data,
      ...variableData,
    };

    await Sample.update(sample, { where: { id: id } });

    res.redirect("/sample/list");
  }

  static async importCsvGet(req, res) {
    res.render("sample/import");
  }

  static async importCsvPost(req, res) {
    if (!req.file) {
      return res.redirect("/sample/import");
    }

    const currentImportId = uuidv4();

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        const sampleToCreate = {
          ProjectId: data.ProjectId,
          importId: currentImportId,
          data: data,
        };

        results.push(sampleToCreate);
      })
      .on("end", async () => {
        fs.unlinkSync(filePath);

        if (results.length > 0) {
          try {
            await Sample.bulkCreate(results);
            res.redirect("/sample/list");
          } catch (error) {
            console.log(error);
            res.redirect("/sample/import");
          }
        } else {
          res.redirect("/sample/import");
        }
      })
      .on("error", (error) => {
        fs.unlinkSync(filePath);
        console.log(error);
        req.flash("message", "Erro ao processar o arquivo .csv!");
        res.redirect("/sample/import");
      });
  }

  static async deleteImportGet(req, res) {
    const samples = await Sample.findAll();

    let importIdsArray = [];
    for (let sample of samples) {
      if (!importIdsArray.includes(sample.dataValues.importId)) {
        importIdsArray.push(sample.dataValues.importId);
      }
    }

    res.render("sample/deleteImport", { importIdsArray });
  }

  static async deleteImportPost(req, res) {
    const importId = req.body.idSelection;

    await Sample.destroy({ where: { importId: importId } });

    res.redirect("/sample/list");
  }
};
