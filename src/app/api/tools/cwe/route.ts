import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing CWE ID' }, { status: 400 });
    }

    // Strip "CWE-" prefix if present
    id = id.toUpperCase().replace('CWE-', '').trim();

    // Import dynamically since it's a node module
    const { CweManager } = require('cwe-sdk');
    const manager = new CweManager();
    const cweData = manager.cweDictionary[id];

    if (!cweData) {
      return NextResponse.json({ success: false, error: 'CWE not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: cweData.attr?.['@_ID'],
        name: cweData.attr?.['@_Name'],
        description: cweData.Description,
        extendedDescription: cweData.Extended_Description,
        likelihood: cweData.Likelihood_Of_Exploit,
        platforms: cweData.Applicable_Platforms,
        status: cweData.attr?.['@_Status']
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}