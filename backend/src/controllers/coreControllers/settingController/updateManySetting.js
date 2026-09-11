const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  // req/body = [{settingKey:"",settingValue}]
  let settingsHasError = false;
  const updateDataArray = [];
  const { settings } = req.body;

  for (const setting of settings) {
    if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
      settingsHasError = true;
      break;
    }

    const { settingKey, settingValue, settingCategory } = setting;

    const updateDoc = {
      $set: {
        settingValue: settingValue,
        removed: false,
        enabled: true,
      },
    };

    if (settingCategory) {
      updateDoc.$setOnInsert = {
        settingCategory: settingCategory,
        valueType: typeof settingValue === 'boolean' ? 'boolean' : 'string',
        isPrivate: false,
        isCoreSetting: false,
      };
    }

    updateDataArray.push({
      updateOne: {
        filter: { settingKey: settingKey },
        update: updateDoc,
        upsert: true,
      },
    });
  }

  if (updateDataArray.length === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settings provided ',
    });
  }
  if (settingsHasError) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Settings provided has Error',
    });
  }
  const result = await Model.bulkWrite(updateDataArray);

  const matched = result?.nMatched || result?.matchedCount || 0;
  const upserted = result?.nUpserted || result?.upsertedCount || 0;
  const modified = result?.nModified || result?.modifiedCount || 0;

  if (matched < 1 && upserted < 1 && modified < 1) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No settings found to update',
    });
  } else {
    return res.status(200).json({
      success: true,
      result: [],
      message: 'Settings updated successfully',
    });
  }
};

module.exports = updateManySetting;
