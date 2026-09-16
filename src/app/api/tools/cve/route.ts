import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing CVE ID' }, { status: 400 });
    }

    id = id.toUpperCase().trim();
    if (!id.startsWith('CVE-')) {
      id = 'CVE-' + id;
    }

    const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${id}`);
    
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch from NVD' }, { status: res.status });
    }

    const data = await res.json();

    if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
      return NextResponse.json({ success: false, error: 'CVE not found or unavailable' }, { status: 404 });
    }

    const vuln = data.vulnerabilities[0].cve;

    // Extract metrics
    let cvss = null;
    let severity = null;
    if (vuln.metrics) {
      const v31 = vuln.metrics.cvssMetricV31?.[0]?.cvssData;
      const v30 = vuln.metrics.cvssMetricV30?.[0]?.cvssData;
      const v2 = vuln.metrics.cvssMetricV2?.[0]?.cvssData;
      
      const bestMetric = v31 || v30 || v2;
      if (bestMetric) {
        cvss = bestMetric.baseScore;
        severity = bestMetric.baseSeverity || vuln.metrics.cvssMetricV31?.[0]?.cvssData?.baseSeverity || vuln.metrics.cvssMetricV2?.[0]?.baseSeverity;
      }
    }

    // Extract CWE
    let cwe = null;
    if (vuln.weaknesses) {
      const primary = vuln.weaknesses[0];
      if (primary && primary.description && primary.description.length > 0) {
        cwe = primary.description[0].value;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: vuln.id,
        description: vuln.descriptions?.[0]?.value || 'No description available',
        published: vuln.published,
        lastModified: vuln.lastModified,
        vulnStatus: vuln.vulnStatus,
        cvss,
        severity,
        cwe,
        references: vuln.references?.map((r: any) => r.url) || []
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}